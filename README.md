Este proyecto crea un login con registro de usuarios que se guardan en una base de datos de MySQL
Para esto utiliza Nodejs y los siguientes paquetes o dependencias :
  - express
  - express-session
  - ejs
  - dotenv
  - bcryptjs
  - mysql
  - nodemon

Para la base de datos en mi caso utilice XAMP para el server de mysql y cree una base de datos llamada login_node,
para despues crear una tabla con las columnas: 
  - id: tipo int y activando el auto-incremento
  - user: tipo varchar (50)
  - name: tipo varchar (100)
  - rol: tipo varchar (50) (esto para establecer dos tipos de usuarios admins y usuarios normales)
  - pass: tipo varchar (255) (la contraseña se ingresa encrypatada utilizando bcryptjs
