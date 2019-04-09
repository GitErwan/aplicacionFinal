
var Medico = require('../models/medico');
var Consulta = require('../models/consulta');
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token
var bcrypt = require('bcryptjs');
var especialidad = require('../models/especialidades');

/**
 * GET ESPECIALIDADES
 * Devuelve todas las especialidades médicas
 */
function getEspecialidades(req, res, next){


        res.status(200).json({
            ok: true,
            medicos : especialidad
        });
  
}

/**
 * GET MEDICOS
 * Devuelve todos los médicos
 */
function getMedicos(req, res, next){
    Medico.find({ }, 'nombre apellido usuario email telefono baja especialidad npacientesasignados') // con esto indico que el get devuelva todos los datos menos la contraseña
    .exec(
        (err, medicos) => {
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de base de datos',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medicos
        });
    });
}

/**
 * POST MEDICOS
 * Crea un médico
 */
function postMedico(req, res, next){
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        apellido: body.apellido,
        usuario: body.usuario,
        password: bcrypt.hashSync(body.password, 10), 
        email: body.email,
        telefono: body.telefono,
        baja: false,
        especialidad: body.especialidad,
        rol: body.rol,
    });

    medico.save( ( err, medicoGuardado ) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({ 
            ok: true,
            medico: medicoGuardado
        });
    });
}

/**
 * PUT MEDICOS
 * Actualiza un médico
 */
function putMedico(req, res, next){
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if (!medico){
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ese usuario no existe',
                    errors: err
                });
            }
        }

        if(body.password==""){ // Si se envía vacía significa que no se quiere cambiar la contraseña, y si no se cifra
            var pass = medico.password;
        }else{
            var pass = bcrypt.hashSync(body.password, 10)
        }
               
        if(medico.nombre != body.nombre) medico.nombre = body.nombre
        if(medico.apellido != body.apellido) medico.apellido = body.apellido
        medico.password = pass 
        if(medico.usuario != body.usuario) medico.usuario = body.usuario
        if(medico.email != body.email) medico.email = body.email
        if(medico.telefono != body.telefono) medico.telefono = body.telefono
        if(medico.baja != body.baja) medico.baja = body.baja
        if(medico.especialidad != body.especialidad) medico.especialidad = body.especialidad
        
        medico.save( ( err, medicoGuardado ) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                }); 
            }

            medicoGuardado.password = 'Me gusta la pizza con piña'; // Esto oculta la contraseña al reenviar los datos en la respuesta

            res.status(200).json({ 
                ok: true,
                medico: medicoGuardado
            });
        }); 
    });
}

/**
 * PUT BAJA MEDICO
 * Los catalanes hacen cosas
 */
async function putBajaMedico(req, res, next){
    var id = req.params.id;

    //Pongo al médico en baja
    await Medico.findByIdAndUpdate( id , { baja:true });

    // Recojo la especialidad del médico
    var especialidad = await Medico.findById( {_id:id}, "especialidad" );
    especialidad = especialidad.especialidad;

    // Recojo las consultas a reasignar
    var consultasParaReasignar = await Consulta.find({ id_medico : id, estado : "Pendiente" })

    // Recojo todos los ids de los médicos de esa especialidad menos la dada de baja y ordenados de menor a mayor según la cantidad de consultas que tienen asignadas
    var idsMedicosDeEsaEspecialidad = await Medico.find({ especialidad:especialidad, baja : false }, "_id",).sort('nconsultasasignadas');
    // Ordenarlos de menor a mayor según la cantidad de consultas que tengan



}

/**
 * DELETE MEDICO
 * Borra un médico
 */
function deleteMedico(req, res, next){
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            }); 
        }

        if (!medicoBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ese usuario con ese id',
            }); 
        }

        res.status(200).json({ 
            ok: true,
            medico: medicoBorrado
        });
    });
}

module.exports = {
    getMedicos,
    postMedico,
    putMedico,
    deleteMedico,
    getEspecialidades,
    putBajaMedico
};