const express = require('express');
const passport = require("passport");
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth')

router.get('/add',(req,res)=>{
    res.render('links/add')
});

router.post("/add", passport.authenticate("local.signup", {
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, password,correo,done) => {
    const {id,nombre,apellido,tel,idRol} = req.body;
    const newUser = {
        id,
        nombre,
        apellido,
        correo,
        tel,
        password,
        idRol
    }
    console.log(newUser)
    newUser.password = await helpers.encryptPassword(password)
    await pool.query('INSERT INTO usuario set ?',[newUser] )
    res.redirect('/vehicles/add/'+id)
}));

/*router.post('/add',async(req,res)=>{
    const {id,nombre,apellido,correo,tel,password,idRol} = req.body;
    const newLink = {
        id,
        nombre,
        apellido,
        correo,
        tel,
        password,
        idRol
    }
    console.log(newLink)
    await pool.query('INSERT INTO usuario set ?',[newLink] )
    res.redirect('/vehicles/add/'+id)
})*/

router.get('/',async (req,res)=>{
    const users = await pool.query('SELECT id,nombre,apellido,correo,rol.rol FROM usuario,rol WHERE usuario.idRol=rol.idRol')
    console.log(users)
    res.render('links/list',{users})
})

router.get('/delete/:id',async (req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM usuario WHERE ID = ?',[id]);
    res.redirect('/links')
})

router.get('/edit',isLoggedIn,async (req,res)=>{
    const user = await pool.query('SELECT tel,password FROM usuario WHERE ID = ?',[req.user.id]);
    res.render('links/edit',{user: user[0]})
})

router.post('/editUser',async (req,res)=>{
    const {tel,password} = req.body;
    const newUser = {
        tel,
        password,
    }
    await pool.query('UPDATE usuario set ? WHERE id = ?',[newUser,req.user.id]);
    res.redirect('/profile')
    req.flash('success','Datos Actualizados')
})

module.exports = router;