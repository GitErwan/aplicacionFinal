var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var medicoController = require('../controllers/medicoController.js')
var fileUpload = require('express-fileupload');
app.use(fileUpload());

app.get('/', medicoController.getMedicos);
app.get('/especialidades', medicoController.getEspecialidades);
app.post('/', medicoController.postMedico);
app.put('/:id', medicoController.putMedico);
app.put('/baja/:id', medicoController.putBajaMedico);
//app.delete('/:id', medicoController.deleteMedico);

module.exports = app;