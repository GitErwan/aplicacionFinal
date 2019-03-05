// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

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

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/proyectoHospitalDB', (err, res) => {
    if (err) throw err;

    console.log("base de datos creada!");
})


// Rutas
app.use('/paciente', pacienteRoutes);
app.use('/medico', medicoRoutes);
app.use('/consulta', consultaRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
var port = 3000;
app.listen(port, () => {
    console.log("Express funcionando en el puerto "+port);
});