
var fs = require('fs');

/**
 * Subir Imagen
 * Sube la imagen del médico o del paciente
 */
function subirImagen(imagen, tipo){
    // Creo la carpeta uploads si no existe
    if(!fs.existsSync('uploads')){
        fs.mkdirSync('uploads');
    }

    var carpeta = `uploads/${tipo}`;

    // Si no existe el directorio lo creo
    if(!fs.existsSync(carpeta)){
        fs.mkdirSync(carpeta);
    }

    if ( !imagen ){ // Si se manda sin imagen coge la de por defecto
        return "imagenDefecto.png"
    }

    // Obtener el nombre del archivo
    var archivo = imagen.imagen;
    var nombreSplit = archivo.name.split('.');
    var extension = nombreSplit[nombreSplit.length -1];

    // Extensiones válidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if ( extensionesValidas.indexOf( extension ) <0 ){ // Si no es ninguna de las extensiones pone la de por defetco
        return "imagenDefecto.png"
    }

    // Nombre archivo personalizado (id + número random + extensión)
    var nombreArchivo = `${ new Date().getTime()}.${ extension }`;

    // Mover archivo del temporal al path
    var path = `uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err =>{
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: "error al mover archivo",
                errors: err
            });
        }
    });
    return path
}

module.exports = {
    subirImagen
};