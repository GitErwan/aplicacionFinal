var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var especialidad = require('./especialidades');

var especialidades = { //esto sirve para fijar unas especialidades y añadir seguridad
    values: especialidad,
    message: '{value} no es una especialidad váida'
};

var estado = { //esto sirve para fijar unos estados por seguridad
    values: ["Cancelada", "Terminada", "Pendiente", "No asignada"],
    message: '{value} no es estado válido'
};

var Schema = mongoose.Schema;

var consultaSchema = new Schema({
    id_medico: { type:Schema.Types.ObjectId, ref: 'medico' },
    id_paciente:{ type:Schema.Types.ObjectId, ref: 'paciente' },
    fecha: { type: Date, required: [true, 'La fecha es obligatoria'] },
    //hora: { type: Date, required: [true, 'La hora es obligatoria'] },
    descripcion_paciente: { type: String, required: [true, 'La descripción es obligatoria'] }, 
    diagnostico_medico: { type: String }, 
    especialidad: { type: String, required: [true, 'La especialidad es obligatoria'], enum: especialidades }, // Debería cogerlo automaticamente
    estado: { type: String, required: [true, 'El estado es obligatorio'], enum: estado, default: "Pendiente"} // poner un valor por defecto
});

consultaSchema.plugin( uniqueValidator, { message: 'el {PATH} debe ser único' });
module.exports = mongoose.model('consulta', consultaSchema);