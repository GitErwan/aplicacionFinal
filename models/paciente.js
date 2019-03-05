var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var pacienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
    password: { type: String, required: [true, 'La contrasña es obligatoria'] },
    dni: { type: String, unique: true, required: [true, 'El DNI obligatoria'] },
    email: { type: String, required: [true, 'El email es obligatorio'] }, 
    telefono: { type: String, required: [true, 'El telefono es obligatorio'] }, 
    direccion: { type: String, required: [true, 'La dirección es obligatoria'] }, 
    tarjeta_sanitaria: { type: String, unique: true, required: [true, 'La tarjeta sanitaria es obligatoria'] }, 
    situacion_actual: { type: String }, 
});

pacienteSchema.plugin( uniqueValidator, { message: 'el {PATH} debe ser único' });
module.exports = mongoose.model('paciente', pacienteSchema);