const Relation = require("../models/relation.model.js");

// Retrieve all relations from the database.
exports.findAll = (req, res) => {
    Relation.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving relations."
            });
        else res.send(data);
    });
};

//Create new relation
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    var studentArr = req.body.students;
    var relationArr = [];
    
    for (let student of studentArr) {
        var newRelation = [];

        newRelation.push(req.body.teacher);
        newRelation.push(student);
        relationArr.push(newRelation);
    }
    console.log(relationArr);

    //Check if relation exists
    Relation.checkRelation(req.body.teacher, studentArr, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                // Save relation in the database
                Relation.create(relationArr, (err, data) => {
                    if (err) {
                        res.status(500).send({
                            message:
                                "Error occurred while registering students" || err.message
                    });
                    } else res.status(204).send(data);
                });
            } else if (err.kind === "found_existing"){
                res.status(500).send({
                    message: "Relation already exists between teacherId " + req.body.teacher + " and " + studentArr
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving students with teacherId " + teacherArr
                });
            }
        }
    });
};

//Get common students
exports.getCommonStudents = (req, res) => {
    var teacherArr = req.query.teacher;

    Relation.getCommonStudents(teacherArr, (err, data) => {    
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Cannot find common students with teacherId " + teacherArr
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving students with teacherId " + teacherArr
                });
            }
        } else res.send(data);
    });
};

//Suspend student
exports.suspend = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    Relation.checkStatus(req.body.student, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Cannot find students " + req.body.student
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving students " + req.body.student
                });
            }
        } else {
            Relation.suspend(req.body.student, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: "Did not find student with id " + req.body.student
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating student with id " + req.body.student
                        });
                    }
                } else res.status(204).send(data);
            }
            );
        }
    });    
};

//Retrieve list of students for notification
exports.retrieveForNotifications = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    var notification = req.body.notification;
    var notifArr = [];
    var notifStudent = [];
    
    if (notification.indexOf("@") !== -1) {
        notifArr = notification.split("@");
        for (var i = 1; i < notifArr.length; i=i+2) {
                notifStudent.push(notifArr[i] + "@" + notifArr[i+1].trim());
        }
    }

    //Get students under teacher who are not suspended
    Relation.getStudents(req.body.teacher, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Cannot find students with teacherId " + req.body.teacher
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving students with teacherId " + req.body.teacher
                });
            }
        } else {
            var studentsUnderTeacher = data;
            if (notifStudent.length) {
                //Check suspend status of mentioned students
                Relation.checkStatus(notifStudent, (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                message: "Cannot find students " + notifStudent
                            });
                        } else {
                            res.status(500).send({
                                message: "Error retrieving students " + notifStudent
                            });
                        }
                    } else {
                        var notif = data;
                        for (let student of notif) {
                            if (JSON.stringify(studentsUnderTeacher).indexOf(JSON.stringify(student)) === -1) {
                                studentsUnderTeacher.push(student);                                
                            }
                        }
                        res.send(studentsUnderTeacher);
                    }
                });
            } else res.send(studentsUnderTeacher);
            
        }
    });
    
};