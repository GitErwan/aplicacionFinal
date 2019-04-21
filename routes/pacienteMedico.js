var express = require('express');
var app = express();
var pacienteMedicoController = require('../controllers/pacienteMedicoController');
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token

app.get('/', mdAutenticacion.verificaToken, pacienteMedicoController.getPacientesMedicos);
app.get('/:id', mdAutenticacion.verificaToken, pacienteMedicoController.getPacienteMedico);
app.post('/', mdAutenticacion.verificaToken, pacienteMedicoController.postPacienteMedico);
app.put('/:id', mdAutenticacion.verificaToken, pacienteMedicoController.putPacienteMedico);

module.exports = app;

