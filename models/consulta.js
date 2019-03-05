var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var especialidad = require('./especialidades');

var especialidades = { //esto sirve para fijar unas especialidades y añadir seguridad
    values: especialidad,
    message: '{value} no es una especialidad váida'
};

var Schema = mongoose.Schema;

var consultaSchema = new Schema({
    id_medico: { type:Schema.Types.ObjectId, ref: 'Medico' },
    id_paciente:{ type:Schema.Types.ObjectId, ref: 'Paciente' },
    fecha: { type: Date, required: [true, 'La fecha es obligatoria'] },
    hora: { type: Date, required: [true, 'La hora es obligatoria'] },
    descripcion_paciente: { type: String, required: [true, 'La descripción es obligatoria'] }, 
    diagnostico_medico: { type: String }, 
    especialidad: { type: String, required: [true, 'La especialidad es obligatoria'], enum: especialidades }, // Debería cogerlo automaticamente
});

consultaSchema.plugin( uniqueValidator, { message: 'el {PATH} debe ser único' });
module.exports = mongoose.model('consulta', consultaSchema);