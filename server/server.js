var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');

var app = express();

//connect to db
mongoose.connect('mongodb://localhost:27017/bulkr');

app.listen(3000, function(){
    console.log('SERVER RUNNING ON 3000');
});

app.get('/',function(request, response){
    response.send("Hello world");
});

app.get("/api",function(request, response){
    response.send({name:"Brent",age:20});
});

app.get("/api/add",function(request,response){
    var chris = new User({
        email: 'brinte',
        password: 'hello'
    });

    chris.save(function(err){
        if(err)throw err;
        
        console.log('user saved');
    })

    response.send("user added");
});