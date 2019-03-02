var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
    usuario: { type: String, required: [true, 'El usuario es obligatorio'] },
    password: { type: String, required: [true, 'La contrasña es obligatoria'] },
    email: { type: String, required: [true, 'El email es obligatorio'] }, 
    telefono: { type: String, required: [true, 'El telefono es obligatorio'] }, 
    baja: { type: Boolean }, 
    especialidad: { type: String, required: [true, 'La especialidad es obligatoria'] }, 
});

pacienteSchema.plugin( uniqueValidator, { message: 'el {PATH} debe ser único' });
module.exports = mongoose.model('medico', medicoSchema);