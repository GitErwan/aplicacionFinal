var Consulta = require('../models/consulta');
var PacienteMedico = require('../models/pacienteMedico');
var Consulta = require('../models/consulta');
var Medico = require('../models/medico');
var PacienteMedico = require('../models/pacienteMedico');
var mdAutenticacion = require('../middlewares/autenticacion'); // Al usar esta variable verifica el token

/**
 * GET CONSULTAS
 * Devuelve todas las consultas
 */
function getConsultas(req, res, next){
    Consulta.find({ })
    .populate('id_medico', 'nombre apellido usuario email telefono baja especialidad')
    .populate('id_paciente', 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual')
    .exec(
        (err, consultas) => {
        if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        res.status(200).json({
            ok: true,
            consultas
        });
    });
}

/**
 * GET CONSULTAS PACIENTE
 * Consulta por el id del paciente y el estado de la consulta, puede ver consultas pendientes, canceladas, terminadas...
 */
function getConsultaPaciente(req, res, next){
    var id = req.params.id;
    var estado = req.params.estado;

    Consulta.find({ estado: estado, id_paciente: id })
        .populate('id_medico', 'nombre apellido usuario email telefono baja especialidad')
        .populate('id_paciente', 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual')
        .exec(
            (err, consultas) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        res.status(200).json({
            ok: true,
            consultas
        });
    });
}

/**
 * GET CONSULTAS MEDICO
 * Consulta por el id del médico, el estado de la consulta, y la especialidad. Puede ver consultas pendientes, canceladas, terminadas...
 */
function getConsultaMedico(req, res, next){
    var id = req.params.id;
    var estado = req.params.estado;
    var especialidad = req.params.especialidad;

    Consulta.find({ estado: estado, id_medico: id, especialidad: especialidad })
        .populate('id_medico', 'nombre apellido usuario email telefono baja especialidad')
        .populate('id_paciente', 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual')
        .exec(
            (err, consultas) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        res.status(200).json({
            ok: true,
            consultas
        });
    });
}

/**
 * GET CONSULTAS ADMINISTRADOR
 *  devuelve las consultas de todos los médicos y filtrado por estado
 */
function getConsultaAdministrador(req, res, next){
    var estado = req.params.estado;

    Consulta.find({ estado: estado })
        .populate('id_medico', 'nombre apellido usuario email telefono baja especialidad')
        .populate('id_paciente', 'nombre apellido dni email telefono direccion tarjeta_sanitaria situacion_actual')
        .exec(
            (err, consultas) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de base de datos',
                    errors: err
            });
        }

        res.status(200).json({
            ok: true,
            consultas
        });
    });
};

/**
 * GET HORAS DISPONIBLES DE CONSULTA DEL MÉDICO
 * Devuelve lashoras de las consultas médicas ocupadas
 */
async function getHorasOcupadas (req, res, next){

    var fecha = req.params.fecha;
    var id = req.params.id;
    var especialidad = req.params.especialidad;

    var Medicos = await PacienteMedico.find({ id_paciente:id}, 'id_medico')
        .populate({
            path: 'id_medico',
            match:{especialidad:especialidad},
            select: '_id especialidad',
        });
    
    // Saco el id del médico que pertenece a esa especialidad
    for(i=0; i<Medicos.length; i++){
        if(Medicos[i]['id_medico']!=null)
            var idMedico = Medicos[i]['id_medico']['_id'];
    }

    // sacar las consultas médicas de ese día
    fechaDesde = new Date(fecha);
    fechaHasta = new Date(fecha);
    fechaHasta.setDate(fechaHasta.getDate()+1);

    let consultasMedico = await Consulta.find({ id_medico: idMedico, estado:"Pendiente", fecha:{"$gte" : fechaDesde, "$lte" : fechaHasta}}, 'fecha');

    // meto todas las horas en un array
    var fechasOcupadas={};
    for(i=0; i<consultasMedico.length; i++){
        if(consultasMedico[i]['fecha']!=null)
            fechasOcupadas[i]=consultasMedico[i]['fecha'];
    }

    res.status(200).json({
        ok: true,
        fechasOcupadas
    });    
};

/**
 * POST CONSULTAS
 * Crea una consulta
 */
async function postConsultas(req, res, next){
    var body = req.body;
    var consulta = new Consulta({
        id_medico: body.id_medico,
        id_paciente: body.id_paciente,
        fecha: body.fecha,
        hora: body.hora, 
        descripcion_paciente: body.descripcion_paciente,
        diagnostico_medico: body.diagnostico_medico,
        especialidad:  body.especialidad,
        estado: body.estado
    });

    consulta.save( ( err, consultaGuardado ) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(201).json({ 
            ok: true,
            consulta: consultaGuardado
        });
    });
    await Medico.findByIdAndUpdate( body.id_medico , {$inc : {nconsultasasignadas: +1}});
};

/**
 * PUT CONSULTAS
 * Acualiza una consulta
 */
async function putConsultas(req, res, next){
    var id = req.params.id;
    var body = req.body;

    Consulta.findById(id, async (err, consulta) =>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if (!consulta){
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ese usuario no existe',
                    errors: err
                });
            }
        }
        await Medico.findByIdAndUpdate( consulta.id_medico , {$inc : {nconsultasasignadas: -1}}); // quito uno al médico de antes
        await Medico.findByIdAndUpdate( body.id_medico , {$inc : {nconsultasasignadas: +1}}); // sumo 1 al médico nuevo

        if(consulta.id_medico != body.id_medico) consulta.id_medico = body.id_medico
        if(consulta.id_paciente != body.id_paciente) consulta.id_paciente = body.id_paciente
        if(consulta.fecha != body.fecha) consulta.fecha = body.fecha
        if(consulta.hora != body.hora) consulta.hora = body.hora
        if(consulta.descripcion_paciente != body.descripcion_paciente) consulta.descripcion_paciente = body.descripcion_paciente
        if(consulta.diagnostico_medico != body.diagnostico_medico) consulta.diagnostico_medico = body.diagnostico_medico
        if(consulta.especialidad != body.especialidad) consulta.especialidad = body.especialidad
        
        consulta.save( ( err, consultaGuardado ) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                }); 
            }

            consultaGuardado.password = 'Me gusta la pizza con piña'; // Esto oculta la contraseña al reenviar los datos en la respuesta

            res.status(200).json({ 
                ok: true,
                consulta: consultaGuardado
            });
        }); 
    });
};

/**
 * BORRAR CONSULTA
 * Esta consulta te da la respuesta a tu mísera vida, pues no, como el nombre indica borra una consulta.
 */
function deleteConsultas(req, res, next){
    var id = req.params.id;

    Consulta.findByIdAndRemove(id, (err, consultaBorrado)=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            }); 
        }

        if (!consultaBorrado){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ese usuario con ese id',
            }); 
        }

        res.status(200).json({ 
            ok: true,
            consulta: consultaBorrado
        });
    });
 };


module.exports = {
    getConsultas,
    getConsultaPaciente,
    getConsultaMedico,
    getConsultaAdministrador,
    getHorasOcupadas,
    postConsultas,
    putConsultas,
    deleteConsultas
};