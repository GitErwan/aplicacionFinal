var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var medicoController = require('../controllers/medicoController.js')

app.get('/', medicoController.getMedicos);
app.get('/especialidades', medicoController.getEspecialidades);
app.post('/', medicoController.postMedico);
app.put('/:id', medicoController.putMedico);
//app.delete('/:id', medicoController.deleteMedico);

module.exports = app;