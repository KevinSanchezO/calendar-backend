const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // x-token headers
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición.'
        })
    }    

    try {
        
        // validates the Json Web Token
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido.'
        })
    }

    next();

}

module.exports = {
    validarJWT
}