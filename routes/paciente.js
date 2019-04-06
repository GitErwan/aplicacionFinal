var express = require('express');
var pacienteController = require('../controllers/pacienteController.js')
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token
var app = express();

app.get('/', pacienteController.getPacientes);
app.get('/:id', pacienteController.getPaciente);
app.post('/', /*mdAutenticacion.verificaToken,*/ pacienteController.postPaciente);
app.put('/:id', pacienteController.putPaciente);
app.put('/baja/:dni', pacienteController.bajaPaciente);
//app.delete('/:id', pacienteController.deletePaciente);

module.exports = app;