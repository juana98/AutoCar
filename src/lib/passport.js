const passport = require('passport');
const helpers = require('../lib/helpers')
const pool = require('../database');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,correo,password,done) => {
    console.log(req.body)
    const rows = await pool.query('SELECT * FROM usuario WHERE correo = ?',[correo]);
    if(rows.length > 0){
        const user = rows[0];
        console.log(user)
        //const validPassword = await helpers.matchPassword(password,user.password)
        //console.log(validPassword)
        if(password === user.password){
            done(null, user, req.flash('success','Welcome'+ user.nombre))
        }else{
            return done(null,false , req.flash('message','Constraseña Incorrecta'))
        }
    }
    else{
        return done(null, false, req.flash('message',"El usuario no esta registrado"))
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,correo,password,done) => {
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
    //  res.redirect('/vehicles/add/'+id)
    return done(null,newUser);
}));

passport.serializeUser((user,done) => {
    done(null,user.id);
});

passport.deserializeUser(async (id,done) => {
    const rows = await pool.query('SELECT * FROM usuario where id = ?',[id]);
    done(null, rows[0]);
});