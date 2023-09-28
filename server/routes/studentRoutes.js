const express = require('express');
const app=express();
const studentController = require('../controllers/studentController');
const csvController=require('../controllers/studentController')


app.get('/students', studentController.getAllStudents);
app.get('/students/:id', studentController.getStudentById);
app.post('/students', studentController.createStudent);
app.put('/students/:id', studentController.updateStudent);
app.delete('/students/:id', studentController.deleteStudent);

module.exports = app;


