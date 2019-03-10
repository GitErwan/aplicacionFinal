var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token
var app = express();

var Paciente = require('../models/paciente');
var Medico = require('../models/medico');
var pacienteMedico = require('../models/pacienteMedico');

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
 * GET UN PACIENTE (con un id)
 */
app.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Paciente.find({ _id:id }, 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual') // con esto indico que el get devuelva todos los datos menos la contraseña
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
app.post('/', /*mdAutenticacion.verificaToken,*/ (req, res)=>{ // recibo todos los datos del post que vienen en la bariable body
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
        asignarMedicos(pacienteGuardado._id);
        res.status(201).json({ 
            ok: true,
            paciente: pacienteGuardado,
            //pacientetoken: req.paciente,
            //medicotoken: req.medico,
        });
    });
});

function asignarMedicos(idUsuario){
    var medicoFinal="a";    
    var medicoCount=0;
    var x =["Dentista"];
    for(i=0;i<x.length;i++){ // Busca todos los médicos de esa especialidad
        Medico.find({ especialidad: x[i] }, 'nombre apellido usuario email telefono baja especialidad') // con esto indico que el get devuelva todos los datos menos la contraseña
            .exec((err, medicos) => {
                if (err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error de base de datos',
                        errors: err
                    });
                }

                medicos.forEach(function(medico){ // Busca la cantidad de pacientes por médico                    
                    var x = pacienteMedico.count({ id_medico: medico._id }) // con esto indico que el get devuelva todos los datos menos la contraseña
                    .exec(
                        (err, countMedicoPaciente) => {
                        if (err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error de base de datos',
                                errors: err
                            });
                        }   
                        
                        if(countMedicoPaciente<=medicoCount){ // Coge el id del médico con menos pacientes                           
                            medicoFinal = medico._id;                            
                            medicoCount = countMedicoPaciente;
                        }
                        return medicoFinal;
                    });
                    console.log(x); 
                });                            
        });   
        console.log(medicoFinal); 
        // Aquí guardo el médico asignado automáticamente en la tabla de relaciones            
        /*var pacientemedico = new pacienteMedico({
            id_medico: medicoFinal,
            id_usuario: idUsuario,            
        });

    
        pacientemedico.save();*/
    }
}

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
                mensaje: 'Error al buscar el usuario',
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

        if(body.password==""){ // Si se envía vacía significa que no se quiere cambiar la contraseña, y si no se cifra
            var pass = paciente.password;
        }else{
            var pass = bcrypt.hashSync(body.password, 10)
        }
               
        if(paciente.nombre != body.nombre) paciente.nombre = body.nombre
        if(paciente.apellido != body.apellido) paciente.apellido = body.apellido
        paciente.password = pass 
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

            pacienteGuardado.password = 'Me gusta la pizza con piña'; // Esto oculta la contraseña al reenviar los datos en la respuesta

            res.status(200).json({ 
                ok: true,
                paciente: pacienteGuardado
            });
        }); 
    });
});

/**
 * BORRAR PACIENTES
 */

 app.delete('/:id', (req, res)=>{
    var id = req.params.id;

    Paciente.findByIdAndRemove(id, (err, pacienteBorrado)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            }); 
        }

        if (!pacienteBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ese usuario con ese id',
            }); 
        }

        res.status(200).json({ 
            ok: true,
            paciente: pacienteBorrado
        });
    });





 });

module.exports = app;
