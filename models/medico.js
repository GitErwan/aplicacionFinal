var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var especialidad = require('./especialidades');

var especialidades = { //esto sirve para fijar unas especialidades y añadir seguridad
    values: especialidad,
    message: '{value} no es una especialidad váida'
};

var rolMedico = { //esto sirve para fijar un rol y añadir seguridad
    values: ["Médico", "Administrador"],
    message: '{value} no es un rol válido'
};

var Schema = mongoose.Schema;
    
var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
    usuario: { type: String, unique: true, required: [true, 'El usuario es obligatorio y/o puede que ya exista'] },
    password: { type: String, required: [true, 'La contrasña es obligatoria'] },
    email: { type: String, required: [true, 'El email es obligatorio'] }, 
    telefono: { type: String, required: [true, 'El telefono es obligatorio'] }, 
    baja: { type: Boolean }, 
    especialidad: { type: String, required: [true, 'La especialidad es obligatoria'], enum: especialidades },
    npacientesasignados: { type: Number, required: [true, 'npacientesasignados obligatorio'], default: 0 }, 
    nconsultasasignadas: { type: Number, required: [true, 'nconsultasasignadas obligatorio'], default: 0 }, 
    rol: { type: String, required: [true, 'El rol es obligatorio'], enum: rolMedico },
    
});

medicoSchema.plugin( uniqueValidator, { message: 'el {PATH} debe ser único' });
module.exports = mongoose.model('medico', medicoSchema);