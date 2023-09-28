const multer = require('multer');
const csv = require('csv-parser');
const cors = require('cors');
const fs = require('fs');
const express=require('express');
const path=require('path');

const app=express();

app.use(cors());

const Student = require('../models/student');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createStudent = async (req, res) => {
  const { firstName, lastName, age } = req.body;

  if (!firstName || !lastName || !age) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const student = new Student({ firstName, lastName, age });

  try {
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateStudent = async (req, res) => {
  const { firstName, lastName, age } = req.body;

  if (!firstName || !lastName || !age) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, age },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndRemove(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(deletedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

