// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/proyectoFinalDB', (err, res) => {
    if (err) throw err;

    console.log(res);
})


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3001, () => {
    console.log("Express funcionando en el puerto 3000");
});