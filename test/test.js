var supertest = require("supertest");
var should = require("should");
const bodyParser = require("body-parser");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("unit test", function () {

    it("should return home page", function (done) {
        server
            .get("/")
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                done();
            });
    });

    it("should register students", function (done) {
        server
            .post("/api/register")
            .send({
                "teacher": "teacherken@gmail.com",
                "students":
                    [
                        "studentjon@gmail.com",
                        "studenthon@gmail.com"
                    ]
            })
            .expect(204)
            .end(function (err, res) {
                res.status.should.equal(204);
                done();
            });
    });

    it("should get list of common students", function (done) {
        var expected = "commonstudent1@gmail.com";
        server
            .get("/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com")
            .expect(200)
            .end(function (err, res) {
                //console.log("common " + JSON.stringify(res.body));
                res.status.should.equal(200);
                res.body.length.should.be.eql(2);
                if (JSON.stringify(res.body).indexOf(expected) === -1) {
                    throw new Error("Result expected to contain " + expected + ", but result: " + JSON.stringify(res.body));
                }
                done();
            });
    });

    it("should suspend student", function (done) {
        server
            .post("/api/suspend")
            .send({
                "student": "studentmary@gmail.com"
            })
            .expect(204)
            .end(function (err, res) {
                res.status.should.equal(204);
                done();
            });
    });

    it("should get list of students who can get notifications", function (done) {
        var expected = "studentjon@gmail.com";
        server
            .post("/api/retrievefornotifications")
            .send({
                "teacher": "teacherjoe@gmail.com",
                "notification": "hello @studentjon@gmail.com"
            })
            .expect(200)
            .end(function (err, res) {
                //console.log("notif " + JSON.stringify(res.body));
                res.status.should.equal(200);
                res.body.length.should.be.eql(3);
                if (JSON.stringify(res.body).indexOf(expected) === -1) {
                    throw new Error("Result expected to contain " + expected + ", but result: " + JSON.stringify(res.body));
                }
                done();
            });
    });

});