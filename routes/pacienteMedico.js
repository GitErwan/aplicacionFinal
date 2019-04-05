var express = require('express');
var app = express();
var pacienteMedicoController = require('../controllers/pacienteMedicoController')

app.get('/', pacienteMedicoController.getPacientesMedicos);
app.get('/:id', pacienteMedicoController.getPacienteMedico);
app.post('/', pacienteMedicoController.postPacienteMedico);
app.put('/:id', pacienteMedicoController.putPacienteMedico);

module.exports = app;

