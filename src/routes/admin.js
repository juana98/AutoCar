const express = require('express');
const passport = require("passport");
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

router.get('/add',(req,res)=>{
    res.render('admin/add')
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

router.get('/usuarios',async (req,res)=>{
    const users = await pool.query('SELECT id,nombre,apellido,correo,rol.rol FROM usuario,rol WHERE usuario.idRol=rol.idRol')
    console.log(users)
    res.render('links/list',{users})
})
router.get('/vehiculos',async (req,res)=>{
    const vehicles = await pool.query('SELECT nombre,placa,marca,modelo,año,color FROM vehiculo,usuario WHERE id=idUsuario')
    const length = [vehicles.length];
    for(i=0;i<vehicles.length;i++){
        length[i] = i+1;
    }
    console.log(vehicles.length)
    console.log(length)
    res.render('vehicles/list',{vehicles,length})
});

router.get('/eventos',(req,res)=>{
    res.render('admin/eventos')
});

router.get('/informes',async (req,res)=>{
    const informes = await pool.query('SELECT nombre,apellido,vehiculo.placa,fechaEntrada,fechaSalida FROM usuario,vehiculo,parqueadero WHERE id=idUsuario and vehiculo.placa=parqueadero.placa')
    //console.log(users)
    res.render('admin/informes',{informes})
})

router.get('/edit',async (req,res)=>{
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