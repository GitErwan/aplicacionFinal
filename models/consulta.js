var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var consultaSchema = new Schema({
    id_medico: { type: String }, // hay que añadir una relación que no se como se hace todavía por ahora se queda así.
    id_paciente: { type: String }, // hay que añadir una relación que no se como se hace todavía por ahora se queda así.
    fecha: { type: Date, required: [true, 'La fecha es obligatoria'] },
    hora: { type: Date, required: [true, 'La hora es obligatoria'] },
    descripcion_paciente: { type: String, required: [true, 'La descripción es obligatoria'] }, 
    diagnostico_medico: { type: String }, 
    especialidad: { type: String, required: [true, 'La especialidad es obligatoria'] }, // Debería cogerlo automaticamente
});

module.exports = mongoose.model('consulta', consultaSchema);