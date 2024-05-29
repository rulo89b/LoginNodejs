// Invocamos a express
const express = require('express');
const app = express();

// Seteamos urlencoder para capturar los datos
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Invocamos a dotenv
const dotenv = require('dotenv');


// Directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

console.log(__dirname);

// Estableciendo el motor de plantillas ejs
app.set('view engine', 'ejs');

// Invocamos a bcryptjs (sirve para encriptar las passwords)
const bcryptjs = require('bcryptjs');

// Variables de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Invocamos al modulo de conexion de la BD
const connection = require('./database/db');

// Estableciendo las rutas
app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/register', (req, res)=>{
    res.render('register');
})

// Regitro
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, rol:rol, pass:passwordHash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Succesful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta:''
            })
        }
    })
})

// Autenticación
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.pass;    
    let passwordHash = await bcryptjs.hash(pass, 8);
	if (user && pass) {
		connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=> {
			if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });			
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].name;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}
});


// Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});

//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});

app.listen(3000, (req, resp) =>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})
