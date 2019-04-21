var express = require('express');
var app = express();
var consultaController = require('../controllers/consultaController.js');
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token


app.get('/', mdAutenticacion.verificaToken, consultaController.getConsultas);
app.get('/paciente/:id/:estado', mdAutenticacion.verificaToken, consultaController.getConsultaPaciente);
app.get('/medico/:id/:especialidad/:estado', mdAutenticacion.verificaToken, consultaController.getConsultaMedico);
app.get('/administrador/:estado', mdAutenticacion.verificaToken, consultaController.getConsultaAdministrador);
app.get('/horasdisponibles/:id/:especialidad/:fecha', mdAutenticacion.verificaToken, consultaController.getHorasOcupadas);
app.post('/', mdAutenticacion.verificaToken, consultaController.postConsultas);
app.put('/:id', mdAutenticacion.verificaToken, consultaController.putConsultas);
//app.delete('/:id', consultaController.deleteConsultas);

module.exports = app;
