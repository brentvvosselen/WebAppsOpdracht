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

//configuration
var port = process.env.PORT || 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

//use body parser to get info from POST and URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, function () {
    console.log('SERVER RUNNING ON ' + port);
});

//generic errorhandler
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get('/', function (request, response) {
    response.send("Hello world");
});

app.get("/api", function (request, response) {
    response.send({ name: "Brent", age: 20 });
});

app.get("/api/add", function (request, response) {
    var chris = new User({
        email: 'brentvanvosselen@live.be',
        password: 'hallo'
    });

    chris.save(function (err) {
        if (err) throw err;

        console.log('user saved');
    })

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
app.get("/api/recipe/getAll/:email",function(req,res){
    User.findOne({
        email: req.params.email
    }).populate('posts')
    .exec(function(err, user){
        if(err || user === null ){
            res.status(500).send("User could not be retrieved");
        }else{
            res.json(user.posts);
        }
    });
});