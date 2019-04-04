var express = require('express');
var app = express();
var consultaController = require('../controllers/consultaController.js')

app.get('/', consultaController.getConsultas);
app.get('/paciente/:id/:estado', consultaController.getConsultaPaciente);
app.get('/medico/:id/:especialidad/:estado', consultaController.getConsultaMedico);
app.get('/administrador/:estado', consultaController.getConsultaAdministrador);
app.get('/horasdisponibles/:id/:especialidad/:fecha', consultaController.getHorasOcupadas);
app.post('/', consultaController.postConsultas);
app.put('/:id', consultaController.putConsultas);
//app.delete('/:id', consultaController.deleteConsultas);

module.exports = app;
