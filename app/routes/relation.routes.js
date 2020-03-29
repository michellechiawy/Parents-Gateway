module.exports = app => {
    const relation = require("../controllers/relation.controller.js");

    // Retrieve all Relations
    app.get("/relations", relation.findAll);

    // Create a new Relation
    app.post("/api/register", relation.create);

    // Retrieve common students with teacherId
    app.get("/api/commonstudents", relation.getCommonStudents);

    // Suspend student
    app.post("/api/suspend", relation.suspend);

    // Retrieve for notifications
    app.post("/api/retrievefornotifications", relation.retrieveForNotifications);
};