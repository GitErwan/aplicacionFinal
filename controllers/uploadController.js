
var fs = require('fs');

/**
 * Subir Imagen
 * Sube la imagen del médico o del paciente
 */
function subirImagen(imagen, tipo){
    //var tipo = req.params.tipo;
    //var id = req.params.id;

    // Creo la carpeta uploads si no existe
    if(!fs.existsSync('uploads')){
        fs.mkdirSync('uploads');
    }

    // Tipos de coleccion
    var tiposValidos = ['medicos', 'pacientes'];
    if( tiposValidos.indexOf( tipo ) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: "Coección no válida",
            errors: { message: "sólo se admite medicos y pacientes"}
        });
    }
    var carpeta = `uploads/${tipo}`;

    // Si no existe el directorio lo creo
    if(!fs.existsSync(carpeta)){
        fs.mkdirSync(carpeta);
    }

    if ( !imagen ){// CREO QUE NO ES NECESARIO PORQUE SIEMPRE VIENE UNA IMAGEN
        console.log(imagen)
        return res.status(400).json({
            ok: false,
            mensaje: "Error seleccionando imagen",
            errors: { message: "selecciona una imagen "}
        });
    }

    // Obtener el nombre del archivo
    var archivo = imagen.imagen;
    var nombreSplit = archivo.name.split('.');
    var extension = nombreSplit[nombreSplit.length -1];

    // Extensiones válidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if ( extensionesValidas.indexOf( extension ) <0 ){
        return res.status(400).json({
            ok: false,
            mensaje: "Extensión no válida",
            errors: { message: "Extensiones válidas : 'png', 'jpg', 'gif', 'jpeg'"}
        });
    }

    // Nombre archivo personalizado (id + número random + extensión)
    var nombreArchivo = `${ new Date().getTime()}.${ extension }`;

    // Mover archivo del temporal al path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

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
    /*res.status(200).json({
        ok: true,
        mensaje : 'Imagen actualizada'
    });*/

}
module.exports = {
    subirImagen
};