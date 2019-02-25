var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UsuariosSchema = Schema({
    id: { type: Number },
    nombre: {type: String},
})

mongoose.model('Usuarios', UsuariosSchema)