var express = require('express');
var app = express();

var Consulta = require('../models/consulta');

/**
 * GET CONSULTAS
 */
app.get('/', (req, res, next) => {
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
});

/**
 * GET CONSULTAS PACIENTE
 *  consulta por el id del paciente y el estado de la consulta, puede ver consultas pendientes, canceladas, terminadas...
 */
app.get('/paciente/:id/:estado', (req, res, next) => {
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
});

/**
 * GET CONSULTAS MEDICO
 *  consulta por el id del médico, el estado de la consulta, y la especialidad. Puede ver consultas pendientes, canceladas, terminadas...
 */
app.get('/medico/:id/:especialidad/:estado', (req, res, next) => {
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
});

/**
 * GET CONSULTAS ADMINISTRADOR
 *  devuelve las consultas de todos los médicos y filtrado por estado
 */
app.get('/administrador/:estado', (req, res, next) => {
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
});

/**
 * GET HORAS DISPONIBLES DE CONSULTA DEL MÉDICO
 */
app.get('/horasdisponibles/:id', async (req, res, next) => {
    var d = new Date();
    var id = req.params.id;
    var horas = new Array();

    for(i=0; i<12; i++){
        // Creo un array bidimensional
        horas[i] = new Array();

        // Meto un número del mes durante un año, ej: si es marzo, empieza por el 3
        d.setMonth(d.getMonth()+1)
        horas[i][0] = d.getMonth();
    }
    //Inicializo la fecha a primera hora que puede hacerse una consulta (esto igual se puede hacer de otra forma)
    d.setMonth(d.getMonth()-12); 
    d.setHours(7);
    d.setMinutes(0);

    for(h=7;h<13;h++){
        for(m=0;m<60;m+10){
            var hCita = h+":"+m;
            horas[0].push(hCita);
        }
    }

    let consultasMedico = await Consulta.find({ id_medico: id });
        
    console.log(horas[0][0]);


    // NOTA: el primer día tiene que ser desde la hora local del pc, no desde las 7 de la mañana
});




/**
 * POST CONSULTAS
 */
app.post('/', (req, res)=>{ // recibo todos los datos del post que vienen en la bariable body
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
});

/**
 * PUT CONSULTAS
 */
app.put('/:id', (req, res) =>{
    var id = req.params.id;
    var body = req.body;

    Consulta.findById(id, (err, consulta)=>{
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
});

/**
 * BBBORRAR CONSULTA
 */

 app.delete('/:id', (req, res)=>{
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
 });

module.exports = app;
