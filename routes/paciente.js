var express = require('express');
var pacienteController = require('../controllers/pacienteController.js')
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());

app.get('/', mdAutenticacion.verificaToken, pacienteController.getPacientes);
app.get('/:id', mdAutenticacion.verificaToken, pacienteController.getPaciente);
app.post('/', mdAutenticacion.verificaToken, pacienteController.postPaciente);
app.put('/:id', pacienteController.putPaciente);
app.put('/baja/:dni', mdAutenticacion.verificaToken, pacienteController.bajaPaciente);
//app.delete('/:id', pacienteController.deletePaciente);

module.exports = app;