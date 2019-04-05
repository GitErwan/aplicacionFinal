var Paciente = require('../models/paciente');
var Medico = require('../models/medico');
var pacienteMedico = require('../models/pacienteMedico');
var especialidad = require('../models/especialidades');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token

/**
 * GET PACIENTES    
 * Devuelve todos los pacientes
 */
function getPacientes(req, res, next) {
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
}

/**
 * GET PACIENTE
 * Devuelve un sólo paciente haciendo la búsqueda por su id
 */
function getPaciente(req, res, next){
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
}

/**
 * POST PACIENTE
 * Crea un nuevo usuario paciente en la base de datos
 * Suma +1 al número de pacientes que tiene cada médico
 */
function postPaciente(req, res, next){
    var body = req.body;
    var tarjetaSanitaria = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000; //devuelve un número de 8 digitos random
    var paciente = new Paciente({
        nombre: body.nombre,
        apellido: body.apellido,
        password: bcrypt.hashSync(body.password, 10), 
        dni: body.dni,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion,
        tarjeta_sanitaria: tarjetaSanitaria,
        baja: false
    });

    paciente.save( ( err, pacienteGuardado ) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        asignaMedicos(pacienteGuardado._id, especialidad);

        res.status(201).json({ 
            ok: true,
            paciente: pacienteGuardado,
            //pacientetoken: req.paciente,
            //medicotoken: req.medico,
        });
    });
}

function asignaMedicos(idPaciente, especialidad){
    for(i=0;i<especialidad.length;i++){ 
        Medico.find({ especialidad: especialidad[i] }, 'nombre apellido dni usuario password especialidad email telefono direccion tarjeta_sanitaria situacion_actual npacientesasignados') // con esto indico que el get devuelva todos los datos menos la contraseña
        .sort('npacientesasignados').exec(
            (err, medicos) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        if(medicos[0]){ // Si existen médicos de esa especialidad se mete la relación
            // creo la consulta de relación con el médico asignado
            var pacientemedico = new pacienteMedico({
                id_medico: medicos[0],
                id_paciente: idPaciente,            
            });
            pacientemedico.save();

            // Sumo al médico +1 en los pacientes asignados
            Medico.findById(medicos[0]._id, (err, medico)=>{
                medico.npacientesasignados = medicos[0].npacientesasignados+1;          
                medico.save();
            });
        }
    });
    }
}

/**
 * PUT PACIENTE
 * Actualiza un paciente con un id
 */
function putPaciente(req, res, next){
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
        if(paciente.baja != body.baja) paciente.baja = body.baja
        
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
}

/**
 * BAJA PACIENTE
 * Cambiar baja del paciente a true
 * Pone consultas a canceladas
 * Resta a médico el número de pacientes asignados (todas las especialidades)
 */
async function  bajaPaciente (req, res, next){
    var dniPaciente = req.params.dni;
    var body = req.body;

    // Guardo el id del paciente para hacer las demás consultas
    let idPaciente = await Paciente.find({ dni: dniPaciente}, 'dni');
    idPaciente = idPaciente[0]['_id'];

  
/*
    // Cambia la baja del paciente a true
    Paciente.findById(idPaciente, (err, paciente)=>{
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

        paciente.baja = true;

        paciente.save( ( err ) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                }); 
            }
        }); 
    });

    // Poner consultas del paciente pendientes a canceladas
*/
}

/**
 * DELETE PACIENTE
 * Borra un paciente con su id
 */
function deletePaciente(req, res, next){
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
}

module.exports = {
    getPacientes,
    getPaciente,
    postPaciente,
    putPaciente,
    bajaPaciente,
    deletePaciente
};
