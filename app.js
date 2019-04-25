// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
var cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
var pacienteRoutes = require('./routes/paciente');
var medicoRoutes = require('./routes/medico');
var consultaRoutes = require('./routes/consulta');
var loginRoutes = require('./routes/login');
var pacienteMedicoRoutes = require('./routes/pacienteMedico');
// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/proyectoHospitalDB', (err, res) => {
    if (err) throw err;

    console.log("base de datos creada!");
});

/* con docker
mongoose.connection.openUri('mongodb://mongo:27017/proyectoHospitalDB', (err, res) => {
    if (err) throw err;

    console.log("base de datos creada!");
});
*/

// Rutas
app.use('/paciente', pacienteRoutes);
app.use('/medico', medicoRoutes);
app.use('/consulta', consultaRoutes);
app.use('/login', loginRoutes);
app.use('/pacienteMedico', pacienteMedicoRoutes);


// Escuchar peticiones
var port = 3000;
app.listen(port, () => {
    console.log("Express funcionando en el puerto "+port);
});