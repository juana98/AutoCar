const express = require('express');
const passport = require("passport");
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

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


module.exports = router;