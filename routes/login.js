var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();

var Paciente = require('../models/paciente');
var Medico = require('../models/medico');

/**
 * LOGIN PARA EL PACIENTE    
 */
app.post('/paciente', (req, res)=>{

    var body = req.body;
    // sólo hace login si no está de baja
    Paciente.findOne( {tarjeta_sanitaria: body.tarjeta_sanitaria, baja:false }, (err, pacienteDB)=>{

        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            }); 
        }

        if (!pacienteDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            }); 
        }

        if( !bcrypt.compareSync(body.password, pacienteDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            }); 
        }

        pacienteDB.password = 'Me gusta la pizza con piña';
        var token = jwt.sign({ paciente: pacienteDB }, SEED,{expiresIn: 14400 }) //4 el tokan expira en cuatro horas

        res.status(200).json({ 
            ok: true,
            paciente: pacienteDB,
            token: token,
            id: pacienteDB._id
        });
    });
});

/**
 * LOGIN PARA EL MEDICO    
 */
app.post('/medico', (req, res)=>{

    var body = req.body;

    Medico.findOne( {usuario: body.usuario }, (err, medicoDB)=>{

        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            }); 
        }

        if (!medicoDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            }); 
        }

        if( !bcrypt.compareSync(body.password, medicoDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            }); 
        }

        medicoDB.password = 'Me gusta la pizza con piña';
        var token = jwt.sign({ medico: medicoDB }, SEED,{expiresIn: 14400 }) //4 el tokan expira en cuatro horas

        res.status(200).json({ 
            ok: true,
            medico: medicoDB,
            token: token,
            id: medicoDB._id
        });
    });

    
});

module.exports = app;