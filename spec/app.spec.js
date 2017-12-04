let Request = require('request');

describe("server",() => {
    beforeAll(() => {});
    let server;
    var token;
    beforeAll(() => {
        server = require('../server');
    });

    //test connection with server
    describe("GET /api/test",() => {
        let data = {};
        beforeAll((done)=>{
            Request({
                method:'GET',
                uri: 'http://localhost:3000/api/test',
                json: true
            },(error,response, body) =>{
                data.status = response.statusCode;
                data.message = response.body;
                done();
            });

        });

        it("status 200",() => {
            expect(data.status).toBe(200);
        });
        it("message workds",() => {
            expect(data.message).toBe("works");
        });
    });

    //right login gets token and status 200
    describe("POST /api/login",() => {
        let data = {};
        beforeAll((done)=> {
            Request({
                method: 'POST',
                uri: 'http://localhost:3000/api/login',
                json: true,
                body: {"email":"test@hallo.com","password":"hallo"} 
            },(error, response, body) => {
                data.status = response.statusCode;
                data.token = response.body.token;
                token = data.token;
                done();
            });
        });
        
        it("status 200", () => {
            expect(data.status).toBe(200);
        });

        it("token not empty",() => {
            expect(data.token).toBeDefined();
        });
    });

    describe("POST /api/login",() => {
        let data = {};
        beforeAll((done) => {
            Request({
                method: 'POST',
                uri: 'http://localhost:3000/api/login',
                json: true,
                body: {"email":"test@hallo.com","password":"hall"}
            },(error, response, body) => {
                data.status = response.statusCode;
                data.token = response.body.token;
                done();
            });
        });

        it("status 401", () => {
            expect(data.status).toBe(401);
        });

        it("token empty",() => {
            expect(data.token).toBeUndefined();
        });
    });

    describe("GET /api/recipe/getAll/:email",() => {
        let data = {};
        beforeAll((done) => {
            Request({
                method: 'GET',
                uri: 'http://localhost:3000/api/recipe/getAll/test@hallo.com',
                json: true
            },(error, response, body) => {
                data.status = response.statusCode;
                data.posts = response.body;
                done();
            }).auth(null,null,true,token);
        });

        it("status 200", () => {
            expect(data.status).toBe(200);
        });

        it("listsize 2",() => {
            expect(data.posts.length).toBe(2);
        });
    });
});