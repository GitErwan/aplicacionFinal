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

/**
 * POST PACIENTES
 */
app.post('/', (req, res)=>{ // recibo todos los datos del post que vienen en la bariable body
    var body = req.body;
    var paciente = new Paciente({
        nombre: body.nombre,
        apellido: body.apellido,
        password: bcrypt.hashSync(body.password, 10), 
        dni: body.dni,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion,
        tarjeta_sanitaria: body.tarjeta_sanitaria,
        situacion_actual: body.situacion_actual
    });

    paciente.save( ( err, pacienteGuardado ) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({ 
            ok: true,
            paciente: pacienteGuardado
        });
    });
});





module.exports = app;
