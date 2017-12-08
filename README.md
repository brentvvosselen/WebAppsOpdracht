###TESTEN
Gebruik maken van vaste databank
BULKR_DB="mongodb://user:user@ds129386.mlab.com:29386/bulkrtest"

###HEROKU LINK
http://bulkr.herokuapp.com/

##GUIDE FOR LOCAL RUNNING
in server.js at the bottom,
put these lines in comment if they are not

```
app.use(express.static(__dirname + '/dist'));
app.all('*',(req,res) => {
    const indexFile = `${__dirname}/dist/index.html`;
    res.status(200).sendFile(indexFile);
})
```

in all the services, the prefix **MUST** contain a link to the localhost server.

```
private _prefix: string = "http://localhost:3000";
```

create an app-env file which contains 2 values
```
export BULKR_SECRET=[insert value]
export BULKR_DB=[insert value]
```
