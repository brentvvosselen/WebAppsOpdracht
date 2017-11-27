//packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config');

//models
var User = require('./models/user');
var Recipe = require('./models/recipe');

//variables
var app = express();

//morgan
app.use(morgan("dev"));

//configuration
var port = process.env.PORT || 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);



//use body parser to get info from POST and URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Resolves the Access-Control-Allow-Origin error in the console
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
app.listen(port, function () {
    console.log('SERVER RUNNING ON ' + port);
});

//generic errorhandler
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

// app.get('/', function (request, response) {
//     response.send("Hello world");
// });

app.get("/api", function (request, response) {
    response.send({ name: "Brent", age: 20 });
});

app.get("/api/add", function (request, response) {
    var chris = new User({
        email: 'brentvanvosselen@live.be',
        password: 'hallo',
    });

    var u1 = new User({
        email: 'joshivermeire@hotmail.com',
        password:'hallo'
    });

    var u2 = new User({
        email: 'josje@hotmail.com',
        password:'hallo'
    });

    var u3 = new User({
        email: 'dylanverstraete@hotmail.com',
        password:'hallo'
    });

    var u4 = new User({
        email: 'dylano@hotmail.com',
        password:'hallo'
    });

    var u5 = new User({
        email: 'jess@hotmail.com',
        password:'hallo'
    });

    var u6 = new User({
        email: 'jessica@hotmail.com',
        password:'hallo'
    });
    

    chris.save(function (err) {
        if (err) throw err;
        console.log('user saved');
    });

    u1.save(function(err){
        if(err)throw err;
        console.log('user saved');
    });
    u2.save(function(err){
        if(err)throw err;
        console.log('user saved');
    });
    u3.save(function(err){
        if(err)throw err;
        console.log('user saved');
    });
    u4.save(function(err){
        if(err)throw err;
        console.log('user saved');
    });
    u5.save(function(err){
        if(err)throw err;
        console.log('user saved');
    });
    u6.save(function(err){
        if(err)throw err;
        console.log('user saved');
    });


    response.send("user added");
});

app.get("/api/users", function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});


//authenticate a user
app.post("/api/authenticate", function (req, res) {
    //find user
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;
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

//gets one user for profile view
app.get("/api/user/:email",function(req,res){
    User.findOne({
        email: req.params.email
    }).select(['_id','email','posts','followers']).populate({
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
            }
        ]
           
    })
    .exec(function(err,user){
        if(err)throw err;
        console.log(user);
        res.json(user);
    })
});

//find users
app.get("/api/user/find/:string",function(req,res){
    User.find({
        email: {"$regex": req.params.string, "$options":"i"}
    }).select('email')
    .exec(function(err,users){
        if(err) res.status(500).send(err);
        res.send(users);
    });
});

//follow a user
app.post("/api/user/:email/follow/:followEmail",function(req,res){
    User.findOne({
        email: req.params.email
    }).select('follows')
    .exec(function(err,you){
        if(err)throw err;
        User.findOne({
            email: req.params.followEmail
        },function(err,other){
            if(err)throw err;
            you.follows.push(other);
            other.followers += 1;
            you.save(function(err){
                if(err)throw err;
                other.save(function(err){
                    if(err)throw err;
                    res.json("Followed " + other.email);
                });
            });
        });
    })
})

//this lets you post a new recipe to the user of email given as parameter
app.post("/api/recipe/add/:email", function (req, res) {
    User.findOne({
        email: req.params.email
    }, function (err, user) {
        if (err) {
            res.status(500).send("Could not retrieve the user")
        } else {
            if (user === null) {
                res.status(500).send("User does not exist");
            } else {
                var recipe = new Recipe({
                    title: req.body.title,
                    description: req.body.description
                });
                user.posts.push(recipe);
                recipe.save(function (err) {
                    if (err) {
                        res.status(500).send("Recipe could not be saved");
                    } else {
                        user.save(function (err) {
                            if (err) {
                                res.status(500).send("Recipe could not be added to the user");
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
app.get("/api/recipe/getAll/:email", function (req, res) {
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
            }
        ]
           
    })
        .exec(function (err, user) {
            if (err || user === null) {
                res.status(500).send("User could not be retrieved");
            } else {
                console.log(user.posts);
                res.json(user.posts);
            }
        });
});

//get one full recipe
app.get("/api/recipe/get/:id",function(req,res){
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
app.post("/api/recipe/save/:email", function (req, res) {;
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
                        if (err) {
                            res.status(500).send("Recipe could not be saved");
                        } else {
                            recipe.save(function (err){
                                if(err){
                                    res.status(500).send("Recipe could not be saved");
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
app.get("/api/recipes/saved/:email",function(req,res){
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
            }
        ]
           
    })
    .exec(function(err,user){
        if(err || user === null){
            res.status(500).send("User could not be retrieved");
        }else{
            console.log(user.saves);
            res.json(user.saves);
        }
    })
});

//like a recipe
app.put('/api/recipes/like/:email',function(req,res){
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
                        if(err){
                            res.status(500).send("Recipe could not be liked");
                        }else{
                            res.json("Recipe liked");
                        }
                    })
                }
            });
        }
    });
});

//feed
app.get('/api/feed/:email/:page',function(req,res){
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
                }
            ]
        }
    })
    .exec(function(err, user){
        if(err) res.status(500).send("Recipe not found");
        
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
            return a.createdAt - b.createdAt;
        });

        posts = posts.slice(index * 3, index*3 + 3);
        console.log(posts);
        res.json(posts);
    });
});

app.use(express.static(path.join(__dirname,'dist')));
app.all('*',(req,res) => {
    const indexFile = `${path.join(__dirname, 'dist')}/index.html`;
    res.status(200).sendFile(indexFile);
})