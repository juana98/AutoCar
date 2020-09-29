const express = require("express");
const router = express.Router();
const pool = require('../database');

const passport = require("passport");
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth')

router.get("/signup",isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

router.get("/signin", isNotLoggedIn,(req, res) => {
  res.render("auth/signin");
});

/*router.post('/signup',(req,res) =>{
   passport.authenticate('local.signup',{
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true 
    })

    res.send('recibido')
});*/
router.post("/signin",isNotLoggedIn, (req, res , next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req,res,next)
});

router.post("/signup",isNotLoggedIn, passport.authenticate("local.signup", {
    successRedirect: "/vehicles/add",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/profile", isLoggedIn,async(req, res) => {
  const rol = await pool.query('SELECT rol FROM rol,usuario WHERE rol.idRol=? and id=?',[req.user.idRol,req.user.id])
  console.log(req.user.idRol)
  const isAdmin = false;
  if(req.user.idRol === 'ADB'){
      res.redirect('admin/usuarios')
  }else{
    res.render('profile',{rol})
  }
});

router.get("/vehicle", isLoggedIn,async(req, res) => {
  const vehicle = await pool.query('SELECT * FROM vehiculo WHERE idUsuario=?',[req.user.id])
  //console.log(rol)
  res.render('vehicle',{vehicle})
});

router.get("/historial", isLoggedIn, async (req, res) => {
  const parqueadero = await pool.query('SELECT idParqueadero,fechaEntrada,fechaSalida FROM parqueadero,vehiculo WHERE parqueadero.placa=vehiculo.placa and idUsuario=?',[req.user.id])
  console.log(parqueadero)
  res.render('historial',{parqueadero})
});

router.get("/eventos", isLoggedIn, async (req, res) => {
  res.render('eventos')
});

router.get("/logout", isLoggedIn, (req,res) => {
  req.logOut();
  res.redirect("/signin")
});
module.exports = router;
