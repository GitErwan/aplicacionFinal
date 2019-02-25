var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST */
router.post('/', function(req, res, next) {
  var Usuarios = require("./usuarios")
  let usuario = new Usuarios();
  usuario.id = req.body.id;
  usuario.nombre = req.body.nombre;

  usuario.save();
});

module.exports = router;
