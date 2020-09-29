const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth')

router.get('/add',(req,res)=>{
    //const {idUsuario} = req.params;
    res.render('vehicles/add')
});

router.post('/add',isNotLoggedIn, async(req,res)=>{
    const {placa,marca,modelo,año,color} = req.body;
    const newLink = {
        placa,
        marca,
        modelo,
        año,
        color,
        idUsuario: req.user.id
    }
    console.log(newLink)
    await pool.query('INSERT INTO vehiculo set ?',[newLink])
    res.redirect('/signin')
})

router.get('/',async (req,res)=>{
    const vehicles = await pool.query('SELECT nombre,placa,marca,modelo,año,color FROM vehiculo,usuario WHERE id=idUsuario')
    const length = [vehicles.length];
    for(i=0;i<vehicles.length;i++){
        length[i] = i+1;
    }
    console.log(vehicles.length)
    console.log(length)
    res.render('vehicles/list',{vehicles,length})
})

router.get('/delete/:placa',async (req,res)=>{
    const {placa} = req.params;
    await pool.query('DELETE FROM vehiculo WHERE PLACA = ?',[placa]);
    res.redirect('/vehicles')
})

router.get('/edit',isLoggedIn,async (req,res)=>{
    const vehicle = await pool.query('SELECT placa,marca,modelo,año,color FROM vehiculo WHERE idUsuario = ?',[req.user.id]);
    res.render('vehicles/edit',{vehicle: vehicle[0]})
})

router.post('/editVehicle',async (req,res)=>{
    const {placa,marca,modelo,año,color} = req.body;
    const newVehicle = {
        placa,
        marca,
        modelo,
        año,
        color
    }
    console.log(newVehicle)
    await pool.query('UPDATE vehiculo set ? WHERE idUsuario = ?',[newVehicle,req.user.id]);
    req.flash('success','Datos Actualizados')
    res.redirect('/profile')
})


module.exports = router;