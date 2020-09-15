const express = require('express');
const router = express.Router();

const pool = require('../database');


router.get('/add',(req,res)=>{
    res.render('vehicles/add')
});

router.post('/add',async(req,res)=>{
    const {placa,marca,modelo,año,color,idUsuario} = req.body;
    const newLink = {
        placa,
        marca,
        modelo,
        año,
        color,
        idUsuario
    }
    console.log(newLink)
    await pool.query('INSERT INTO vehiculo set ?',[newLink] )
    res.redirect('/vehicles')
})

router.get('/',async (req,res)=>{
    const vehicles = await pool.query('SELECT nombre,placa,marca,modelo,año,color FROM vehiculo,usuario WHERE id=idUsuario')
    console.log(vehicles)
    res.render('vehicles/list',{vehicles})
})

router.get('/delete/:placa',async (req,res)=>{
    const {placa} = req.params;
    await pool.query('DELETE FROM vehiculo WHERE PLACA = ?',[placa]);
    res.redirect('/vehicles')
})
module.exports = router;