var express = require('express');


var app = express();

app.listen(3000, function(){
    console.log('SERVER RUNNING ON 3000');
});

app.get('/',function(request, response){
    response.send("Hello world");
})