var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token
var medicoController = require('../controllers/medicoController.js')
var fileUpload = require('express-fileupload');
app.use(fileUpload());

app.get('/',/* mdAutenticacion.verificaToken,*/ medicoController.getMedicos);
app.get('/especialidades', mdAutenticacion.verificaToken, medicoController.getEspecialidades);
app.post('/', /*mdAutenticacion.verificaToken, */medicoController.postMedico);
app.put('/:id', mdAutenticacion.verificaToken, medicoController.putMedico);
app.put('/baja/:id', mdAutenticacion.verificaToken, medicoController.putBajaMedico);
//app.delete('/:id', medicoController.deleteMedico);

module.exports = app;