const sql = require("./db.js");

// constructor
const Relation = function (relation) {
    this.teacherId = relation.teacherId;
    this.studentId = relation.studentId;
};

Relation.getAll = result => {
    sql.query("SELECT * FROM relation", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("relation: ", res);
        result(null, res);
    });
};

Relation.create = (newRelation, result) => {
    sql.query("INSERT INTO relation (teacherId, studentId) VALUES ?", [newRelation], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created relation: ", { newRelation });
        result(null, { newRelation });
    });
};

Relation.getCommonStudents = (teacherArr, result) => {
        sql.query("SELECT studentId as students FROM relation WHERE teacherid IN (?) group by studentId having count(*) > ?", [teacherArr, teacherArr.length-1], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("found common students: ", res);
                result(null, res);
                return;
            }

            // not found 
            result({ kind: "not_found" }, null);
        });
};

Relation.suspend = (studentId, result) => {
    sql.query(
        "UPDATE student SET suspendStatus = 'Y' WHERE studentId = ?", studentId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found student with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated student: ", studentId);
            result(null, studentId);
        }
    );
};

Relation.getStudents = (teacherId, result) => {
    sql.query(
        "select r.studentId from relation r join student s on r.studentId = s.studentId where r.teacherId = ? and s.suspendStatus = 'N'", teacherId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.length) {
                console.log("found students (not suspended) under teacher " + teacherId + ": ", res);
                result(null, res);
                return;
            }

            // not found 
            result({ kind: "not_found" }, null);
        }
    );
};

Relation.checkStatus = (studentArr, result) => {
    sql.query(
        "select studentId from student where studentId IN (?) and suspendStatus = 'N'", [studentArr], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.length) {
                console.log("found status of students: ", res);
                result(null, res);
                return;
            }

            // not found 
            result({ kind: "not_found" }, null);
        }
    );
};

Relation.checkRelation = (teacherId, studentArr, result) => {
    sql.query(
        "select * from relation where teacherId = ? and studentId IN (?)", [teacherId, studentArr], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.length) {
                console.log("found existing relation", res);
                result({ kind: "found_existing" }, res);
                return;
            }

            // not found 
            result({ kind: "not_found" }, null);
        }
    );
};

module.exports = Relation;