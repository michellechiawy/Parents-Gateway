# NodeJS API Asessment Submission

## Background
Teachers need a system where they can perform administrative functions for their students.

## Technologies Used
1. Backend code - NodeJS
2. Database - MySQL
3. Testing - Mocha, Should, Supertest

## Get Started
1. Create your database and run database scripts found in `Database Script.txt` (Step 1 and 2)
2. Configure connections to the database in file `/app/config/db.config.js`
3. Navigate to the project directory and execute the following in your console.
```
node server.js
```
The console should show:
```
Server is running on port 3000.
Successfully connected to the database.
```

## Developed API endpoints
1. /relations
2. /api/register
3. /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com
4. /api/suspend
5. /api/retrievefornotifications

## Running Unit Tests
1. Ensure application is running on port 3000 first.
2. Open a new console, navigate to the project directory and execute the following.
```
npm test
```
The console should show:
```
> govtech@1.0.0 test <project pathway>
> mocha ***/test.js



  unit test
    √ should return home page
    √ should register students
    √ should get list of common students
    √ should suspend student
    √ should get list of students who can get notifications


  5 passing (65ms)
```
3. Please run Step 3 of database scripts found in `Database Script.txt` after testing to revert database changes

## Postman Collection
Can be found in `Govtech.postman_collection.json`


