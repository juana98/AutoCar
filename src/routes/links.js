const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add',(req,res)=>{
    res.render('links/add')
});

router.post('/add',async(req,res)=>{
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
    res.redirect('/links')
})

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
module.exports = router;