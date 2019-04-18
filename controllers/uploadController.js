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

    // Obtener el nombre del archivo
    var archivo = imagen.imagen;
    var nombreSplit = archivo.name.split('.');
    var extension = nombreSplit[nombreSplit.length -1];

    // Nombre archivo personalizado (id + número random + extensión)
    var nombreArchivo = `${ new Date().getTime()}.${ extension }`;

    // Mover archivo del temporal al path
    var path = `uploads/${ tipo }/${ nombreArchivo }`;

    return path
}
module.exports = {
    subirImagen
};