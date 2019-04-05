var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();
var loginController = require('../controllers/loginController.js')

app.post('/paciente', loginController.logPaciente);
app.post('/medico', loginController.logMedico);

module.exports = app;