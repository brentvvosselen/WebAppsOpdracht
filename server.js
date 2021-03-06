//packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('express-jwt')
let auth = jwt({secret:process.env.BULKR_SECRET, userProperty: 'payload'});

let passport = require('passport');

require('./passport');

//models
var User = require('./models/user');
var Recipe = require('./models/recipe');
var Image = require('./models/image');

//variables
var app = express();

//morgan
app.use(morgan("dev"));

//configuration
var port = process.env.PORT || 3000;
mongoose.connect(process.env.BULKR_DB);
app.set('superSecret', process.env.BULKR_SECRET);

//use body parser to get info from POST and URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));

// Resolves the Access-Control-Allow-Origin error in the console
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

//passport
app.use(passport.initialize());

app.listen(port, function () {
    console.log('SERVER RUNNING ON ' + port);
});

//generic errorhandler
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get('/api/test',function(req,res,next){
    res.status(200).json({"message": "works"});
})

//register
app.post('/api/register', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    var user = new User();
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function(err){
        if(err){ return next(err); }
        return res.json({token: user.generateJWT()});
    });
});

//login
app.post('/api/login',function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json(
            {message: 'Please fill out all fields'}
        );
    }
    //passport only uses username
    req.body.username = req.body.email;
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }
        if(user){
            return res.json({token: user.generateJWT()});
        }else{
            return res.status(401).json(info);
        }
    })(req, res, next);
});

app.post('/api/checkusername',function(req,res,next){
    User.find({
        email: req.body.email
    },function(err,user){
        if (err) { return next(err); }
        if(user.length){
            res.json({'email':'alreadyexists'});
        }else{
            res.json({'email':'ok'});
        }
    })
});

//authenticate a user
app.post("/api/authenticate", function (req, res, next) {
    //find user
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) { return next(err); }
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            //check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                //if user found and password right
                //create a token with only our given payload
                const payload = {
                    email: user.email
                };
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 1440 //the password expires in 24 hours
                });
                // return the info and token as JSON
                res.json({
                    success: true,
                    message: 'token found',
                    token: token
                });
            }
        }
    });
});

//get profile picture
app.get("/api/user/picture/:email",function(req,res,next){
    User.findOne({
        email: req.params.email
    }).populate('picture')
    .exec(function(err,user){
        if (err) { return next(err); }
        res.json(user.picture);
    })
})
//change profile picture
app.post("/api/user/picture/:email", function(req,res,next){
    if(!req.body.filename || !req.body.filetype || !req.body.value){
        res.status(400).json({message: 'No picture'});
    }else{
        User.findOne({
            email: req.params.email
        },function(err,user){
            if (err) { return next(err); }
            if(user.picture){
                Image.remove({_id: user.picture},function(err){
                    if (err) { return next(err); }
                });
            }
            var newImage = new Image({
                filename: req.body.filename,
                filetype: req.body.filetype,
                value: req.body.value
            });

            user.picture = newImage;

            newImage.save(function(err){
                if (err) { return next(err); }
            });

            user.save(function(err){
                if (err) { return next(err); }
                res.json("succes");
            });
        });
    }
});

//gets one user for profile view
app.get("/api/user/:email",auth, function(req,res,next){
    User.findOne({
        email: req.params.email
    }).select(['_id','email','posts','followers','picture','poster']).populate(
        [{path:'posts',
        model: 'Recipe',
        populate:[
            {
                path:'likes',
                model:'User',
                select:['email']
            },
            {
                path:'saves',
                model:'User',
                select:['email']
            },
            {
                path:'picture',
                model:'Image'
            },
            {
                path:'poster',
                model:'User',
                populate:{
                    path:'picture',
                    model:'Image'
                }
            }
        ]},
        {
            path:'picture',
            model:'Image'
        }]

           
    )
    .exec(function(err,user){
        if (err) { return next(err); }
        if(!user){ return next(err);}
        user.posts.sort(function(a,b){
            return b.createdAt - a.createdAt;
        });
        res.json(user);
    })
});

//find users
app.get("/api/user/find/:string",auth,function(req,res, next){
   
    if(req.params.string === "+nouser+"){
        console.log("empty");
        res.json([]);
        
    }else{
        User.find({
            email: {"$regex": req.params.string, "$options":"i"}
        }).select(['email','picture','followers']).populate('picture')
        .exec(function(err,users){
            if (err) { return next(err); }
            
            res.send(users.splice(0,5));
            
        });
    }
   
});

//follow a user
app.post("/api/user/:email/follow/:followEmail",auth,function(req,res, next){
    User.findOne({
        email: req.params.email
    }).select('follows')
    .exec(function(err,you){
        if (err) { return next(err); }
        User.findOne({
            email: req.params.followEmail
        },function(err,other){
            if (err) { return next(err); }
            you.follows.push(other);
            other.followers += 1;
            you.save(function(err){
                if (err) { return next(err); }
                other.save(function(err){
                    if (err) { return next(err); }
                    res.json("Followed " + other.email);
                });
            });
        });
    });
});

//unfollow a user
app.put("/api/user/:email/unfollow/:unfollowEmail",function(req,res, next){
    User.findOne({
        email: req.params.email
    }).select('follows')
    .exec(function(err,you){
        if (err) { return next(err); }
        User.findOne({
            email: req.params.unfollowEmail
        }).select('followers')
        .exec(function(err, other){
            if (err) { return next(err); }
            other.followers -= 1;
            var index = you.follows.indexOf(other._id);
            you.follows.splice(index,1);
            you.save(function(err){
                if (err) { return next(err); }
            });
            other.save(function(err){
                if (err) { return next(err); }
            });
            res.json("succes");
        })
    });
});

//does follow user
app.get("/api/user/:email/doesFollow/:followEmail",function(req,res, next){
    User.findOne({
        email: req.params.email
    }).select('follows')
    .exec(function (err,you){
        if (err) { return next(err); }
        User.findOne({
            email: req.params.followEmail
        }).select("_id")
        .exec(function(err,other){
            if (err) { return next(err); }
            var index = you.follows.indexOf(other._id);
            if(index >= 0){
                res.json(true);
            }else{
                res.json(false);
            }
        });
    });
});

//this lets you post a new recipe to the user of email given as parameter
app.post("/api/recipe/add/:email",auth, function (req, res, next) {
    User.findOne({
        email: req.params.email
    }, function (err, user) {
        if (err) { return next(err); 
        } else {
            if (user === null) {
                res.status(500).send("User does not exist");
            } else {
                var image = undefined;

                if(req.body.picture){
                    var image = new Image({
                        filename: req.body.picture.filename,
                        filetype: req.body.picture.filetype,
                        value: req.body.picture.value
                    });
                }
                
                var recipe = new Recipe({
                    title: req.body.title,
                    description: req.body.description,
                    picture: image,
                    poster: user
                });
                console.log(req.body);
                user.posts.push(recipe);
                if(req.body.picture){
                    image.save(function(err){
                        if (err) { return next(err); }
                    });
                }
                recipe.save(function (err) {
                    if (err) { return next(err); 
                    } else {
                        user.save(function (err) {
                            if (err) { return next(err);
                            } else {
                                res.json("Succes");
                            }
                        });
                    }
                });
               
                
            }
        }
    });
});

//this gives you all the recipes from the current user
app.get("/api/recipe/getAll/:email",auth,function (req, res, next) {
    User.findOne({
        email: req.params.email
    }).populate({
        path:'posts',
        model: 'Recipe',
        populate:[
            {
                path:'likes',
                model:'User',
                select:['email']
            },
            {
                path:'saves',
                model:'User',
                select:['email']
            },
            {
                path:'picture',
                model:'Image'
            },
            {
                path:'poster',
                model:'User',
                populate:{
                    path:'picture',
                    model:'Image'
                }
            }
        ]
           
    })
        .exec(function (err, user) {
            if (err || user === null) {
                res.status(500).send("User could not be retrieved");
            } else {
                var posts = user.posts;
                posts.sort(function(a,b){
                    return b.createdAt - a.createdAt;
                });
                res.json(posts);
            }
        });
});

//get one full recipe
app.get("/api/recipe/get/:id",auth,function(req,res, next){
    Recipe.findOne({
        _id: req.params.id
    }).populate('likes',['email'])
    .exec(function(err,recipe){
        if(err || recipe === null){
            res.status(500).send("Recipe could not be retrieved");
        }else{
            res.json(recipe);
        }
});
});

//save a recipe
app.post("/api/recipe/save/:email", auth,function (req, res, next) {;
    console.log(req.body);
    User.findOne({
        email: req.params.email
    }, function (err, user) {
        if (err || user === null) {
            res.status(500).send("User could not be retrieved");
        } else {
            Recipe.findOne({
                _id: req.body.recipeid
            }, function (err, recipe) {
                if (err || recipe === null) {
                    res.status(500).send("Recipe could not be retrieved");
                } else {
                    recipe.saves.push(user);
                    user.saves.push(recipe);
                    user.save(function (err) {
                        if (err) { return next(err); 
                        } else {
                            recipe.save(function (err){
                                if (err) { return next(err); 
                                }else{
                                    res.json("You saved the recipe");
                                }
                            })
                            
                        }
                    });
                }
            });
        }
    });
}
);

//get all the saved recipes of user
app.get("/api/recipes/saved/:email",auth,function(req,res, next){
    User.findOne({
        email: req.params.email
    }).populate({
        path:'saves',
        model: 'Recipe',
        populate:[
            {
                path:'likes',
                model:'User',
                select:['email']
            },
            {
                path:'saves',
                model:'User',
                select:['email']
            },
            {
                path:'picture',
                model:'Image'
            },
            {
                path:'poster',
                model:'User',
                populate:{
                    path:'picture',
                    model:'Image'
                }
            }
        ]
           
    })
    .exec(function(err,user){
        if(err || user === null){
            res.status(500).send("User could not be retrieved");
        }else{
            console.log(user.saves);
            res.json(user.saves.reverse());
        }
    })
});

//like a recipe
app.put('/api/recipes/like/:email',auth,function(req,res, next){
    console.log(req.body);
    Recipe.findOne({
        _id: req.body.recipeid
    },function(err, recipe){
        if(err || recipe === null){
            res.status(500).send("Recipe could not be retrieved");
        }else{
            User.findOne({
                email: req.params.email
            },function(err,user){
                if(err || user === null){
                    res.status(500).send("User could not be retrieved");
                }else{
                    recipe.likes.push(user);
                    recipe.save(function(err){
                        if (err) { return next(err); 
                        }else{
                            res.json("Recipe liked");
                        }
                    })
                }
            });
        }
    });
});

//unlike a recipe
app.put('/api/recipes/unlike/:email',function(req,res, next){
    Recipe.findOne({
        _id: req.body.recipeid
    },function(err,recipe){
        if( err || recipe === null){
            res.status(500).send('Recipe could not be retrieved');
        }else{
            User.findOne({
                email: req.params.email
            },function(err,user){
                if(err || user === null){
                    res.status(500).send("User could not be retrieved");
                }else{
                    var userIndex = recipe.likes.indexOf(user._id);

                    recipe.likes.splice(userIndex,1);

                    recipe.save(function(err){
                        if (err) { return next(err); }
                        res.json("unliked"); 
                    });
                   
                }});
                }
            })
            
        }
    );

//feed
app.get('/api/feed/:email/:page',auth,function(req,res, next){
    User.findOne({
        email: req.params.email
    }).select('follows').populate({
        path:'follows',
        model:'User',
        populate:{
            path:'posts',
            model: 'Recipe',
            populate:[
                {
                    path:'likes',
                    model:'User',
                    select:['email']
                },
                {
                    path:'saves',
                    model:'User',
                    select:['email']
                },
                {
                    path:'picture',
                    model:'Image'
                },
                {
                    path:'poster',
                    model:'User',
                    populate:{
                        path:'picture',
                        model:'Image'
                    }
                }
            ]
        }
    })
    .exec(function(err, user){
        if (err) { return next(err); }
        
        var users = user.follows;
        var posts = [];
        users.forEach(element => {
            var userposts = element.posts;
            userposts.forEach(post => {
                posts.push(post);
            })
        });

        
        var index = req.params.page;
        posts.sort(function(a,b){
            return b.createdAt - a.createdAt;
        });

        posts = posts.slice(index * 5, index*5 + 5);
        res.json(posts);
    });
});


//in comment for local running

app.use(express.static(__dirname + '/dist'));
app.all('*',(req,res) => {
    const indexFile = `${__dirname}/dist/index.html`;
    res.status(200).sendFile(indexFile);
})