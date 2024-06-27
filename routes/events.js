/**
 * Event routes
 * 
 * host + /api/events
 */
const {getEventos, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events')
const { Router } = require('express');
const router = Router();
const  {validarJWT} = require("../middlewares/validar-jwt")
const {check} = require("express-validator");
const { validarCampos } = require('../middlewares/validar-campos');
const {isDate} = require('../helpers/isDate')

// applies the middleware to all the requests
// all the request under use applies it, every other doesn't
router.use(validarJWT);

// Todas tienen que pasar por la validacion del JWT
// Obtener Eventos
router.get('/', getEventos)

// Crear Evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de inicio es obligatoria').custom(isDate),
        validarCampos
    ], 
    crearEvento)

// Actualizar Evento
router.put('/:id', actualizarEvento)

// Borrar Evento
router.delete('/:id', eliminarEvento)

module.exports = router