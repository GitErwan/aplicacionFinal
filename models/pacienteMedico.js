var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pacienteMedicoSchema = new Schema({
    id_medico: { type:Schema.Types.ObjectId, ref: 'medico' },
    id_paciente:{ type:Schema.Types.ObjectId, ref: 'paciente' },
    descripionActual: { type: String },
});

module.exports = mongoose.model('pacienteMedico', pacienteMedicoSchema);