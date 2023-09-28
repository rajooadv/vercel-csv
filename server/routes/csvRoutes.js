const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const csvController = require('../controllers/csvController');
const app=express();



app.post('/uploadCsv', upload.single('csvFile'),csvController.csvUpload)

module.exports = app;




