var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var uploadController = require('../controllers/uploadController.js')

app.put('/:tipo/:id', uploadController.subirImagen);

module.exports = app;