var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/**
 * VERIFICAR TOKEN (MIDDLEWARE)
*/
exports.verificaToken = function(req, res, next){
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded)=>{
        if (err){
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.paciente = decoded.paciente; // para saber que paciente ha hecho la petición
        req.medico = decoded.medico; // para saber que medico ha hecho la petición

        next();
    });

}
