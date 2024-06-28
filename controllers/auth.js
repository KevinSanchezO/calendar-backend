const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        // Allows the existence of only one instance of a password
        let usuario = await Usuario.findOne( { email } );
        console.log(usuario)

        if (usuario) { // returns in case of an user with that same email has been found
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con el correo ingresado.'
            })
        }

        usuario = new Usuario(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // saves the new user
        await usuario.save();

        // Generate JSON WEB TOKEN
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }

};

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        // Allows the existence of only one instance of a password
        let usuario = await Usuario.findOne( { email } );
        console.log(usuario)

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con el correo ingresado.' // is better to share a more vague message like email or password incorrect
            })
        }

        // confirm password
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta.'
            })
        }

       // Generate JSON WEB TOKEN
       const token = await generarJWT(usuario.id, usuario.name);


        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }
};

const revalidarToken = async (req, res = response) => {

    const {uid, name} = req;

    // Generate a new JWT y return it
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid, name,
        token
    })

};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}