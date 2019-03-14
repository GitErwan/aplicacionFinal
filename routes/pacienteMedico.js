var express = require('express');
var app = express();

var pacienteMedico = require('../models/pacienteMedico');

/**
 * GET PACIENTEMEDICO
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
 * POST PACIENTEMEDICO
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



/**
 * PUT PACIENTEMEDICO
 */
app.put('/:id', (req, res) =>{
    var id = req.params.id;
    var body = req.body;

    pacienteMedico.findById(id, (err, pacientemedico)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if (!pacientemedico){
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ese usuario no existe',
                    errors: err
                });
            }
        }
        
        pacientemedico.id_medico = body.id_medico
        pacientemedico.id_paciente = body.id_paciente
        pacientemedico.descripionActual = body.descripionActual
        
        pacientemedico.save( ( err, pacientemedicoGuardado ) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                }); 
            }

            res.status(200).json({ 
                ok: true,
                pacientemedico: pacientemedicoGuardado
            });
        }); 
    });
});
















module.exports = app;

