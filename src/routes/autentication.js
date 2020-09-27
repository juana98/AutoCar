const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/signup',(req,res) =>{
    res.render('links/add')
});

/*router.post('/signup',(req,res) =>{
   passport.authenticate('local.signup',{
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true 
    })

    res.send('recibido')
});*/

router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true 
}))

router.get('/profile',(req,res) => {
   res.send('this is your  profile') 
});

module.exports = router;