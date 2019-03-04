var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();

var Paciente = require('../models/paciente');

/**
 * GET PACIENTES
 */
app.get('/', (req, res, next) => {
    Paciente.find({ }, 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual') // con esto indico que el get devuelva todos los datos menos la contraseña
        .exec(
            (err, pacientes) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        res.status(200).json({
            ok: true,
            pacientes
        });

    });
});


module.exports = app;
