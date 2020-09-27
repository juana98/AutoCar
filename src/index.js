const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const path = require('path');
const passport = require('passport');

//inicializacion
const app = express();
require('./lib/passport');

//settings

app.set('port',process.env.PORT || 4000); 
app.set('views',path.join(__dirname,'views')); 
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}) )

app.set('view engine','.hbs');

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global variable
app.use((req,res,next)=>{
    next();

});
//Routes
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/links',require('./routes/links'));
app.use('/vehicles',require('./routes/vehicles'));


//Public
app.use(express.static(path.join(__dirname,'public')))
//Starting server
app.listen(app.get('port'),()=>{
    console.log('server on port', app.get('port'))
})