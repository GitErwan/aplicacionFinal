var express = require('express');
var app = express();

var pacienteMedico = require('../models/pacienteMedico');

/**
 * GET MEDICOS
 */
app.get('/', (req, res, next) => {
    pacienteMedico.find({ }) // con esto indico que el get devuelva todos los datos menos la contraseña
        .populate('id_medico', 'nombre apellido usuario email telefono baja especialidad')
        .populate('id_paciente', 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual')
        .exec(
            (err, pacienteMedicos) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        res.status(200).json({
            ok: true,
            pacienteMedicos
        });
    });
});

/**
 * POST MEDICOS
 */
app.post('/', (req, res)=>{ // recibo todos los datos del post que vienen en la bariable body
    var body = req.body;
    var pacientemedico = new pacienteMedico({
        id_medico: body.id_medico,
        id_paciente: body.id_paciente,
        descripionActual: body.descripionActual        
    });

    pacientemedico.save( ( err, pacienteMedicoGuardado ) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el pacienteMedico',
                errors: err
            });
        }
        res.status(201).json({ 
            ok: true,
            pacienteMedico: pacienteMedicoGuardado
        });
    });
});

module.exports = app;