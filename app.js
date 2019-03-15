// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });

 /**
  * Body Parser
  */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/**
 * Importar rutas
 */
var appRoutes = require('./routes/app');
var pacienteRoutes = require('./routes/paciente');
var medicoRoutes = require('./routes/medico');
var consultaRoutes = require('./routes/consulta');
var loginRoutes = require('./routes/login');
var pacienteMedicoRoutes = require('./routes/pacienteMedico');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/proyectoHospitalDB', (err, res) => {
    if (err) throw err;

    console.log("base de datos creada!");
})


// Rutas
app.use('/paciente', pacienteRoutes);
app.use('/medico', medicoRoutes);
app.use('/consulta', consultaRoutes);
app.use('/login', loginRoutes);
app.use('/pacienteMedico', pacienteMedicoRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
var port = 3002;
app.listen(port, () => {
    console.log("Express funcionando en el puerto "+port);
});