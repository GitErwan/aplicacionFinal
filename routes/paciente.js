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

/**
 * PUT PACIENTES
 */
app.put('/:id', (req, res) =>{
    var id = req.params.id;
    var body = req.body;

    Paciente.findById(id, (err, paciente)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al bubscar el usuario',
                errors: err
            });
        }

        if (!paciente){
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ese usuario no existe',
                    errors: err
                });
            }
        }

        if(body.password != paciente.password){
            var passcod = bcrypt.hashSync(body.password, 10) // Codifico la contraseña nueva
        }else{
            var passcod = body.password;
        }
        
        if(paciente.nombre != body.nombre) paciente.nombre = body.nombre
        if(paciente.apellido != body.apellido) paciente.apellido = body.apellido
        paciente.password = passcod
        if(paciente.dni != body.dni) paciente.dni = body.dni
        if(paciente.email != body.email) paciente.email = body.email
        if(paciente.telefono != body.telefono) paciente.telefono = body.telefono
        if(paciente.direccion != body.direccion) paciente.direccion = body.direccion
        if(paciente.tarjeta_sanitaria != body.tarjeta_sanitaria) paciente.tarjeta_sanitaria = body.tarjeta_sanitaria
        if(paciente.situacion_actual != body.situacion_actual) paciente.situacion_actual = body.situacion_actual

        
        
        paciente.save( ( err, pacienteGuardado ) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                }); 
            }

            //pacienteGuardado.password = 'Me gusta la pizza con piña'; // Esto oculta la contraseña al reenviar los datos en la respuesta

            res.status(200).json({ 
                ok: true,
                paciente: pacienteGuardado
            });
        }); 
    });
});



module.exports = app;
