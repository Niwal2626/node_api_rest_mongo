const express = require('express')
const mongoose = require('mongoose')
const bodyParser= require('body-parser')
const{config}=require('dotenv')
config()

const bookRoutes=require('./routes/book.routes')

//USAMOS EXPRESS PARA los middlewares
const app= express();
app.use(bodyParser.json()) //Parseador de Bodies


//Conectaremos la base de datos

//FORMA DEL VIDEO
// mongoose.connect(process.env.MONGO_URL,{dbName: process.env.MONGO_DB_NAME})
// const db = mongoose.connection;

/* 
//MANEJO DE ERRORES EN LA CONEXION
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));
   
*/
  //MEJOR PRACTICA(asincronismo)
const db = mongoose.connection;
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL,{ dbName: process.env.MONGO_DB_NAME });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}
connectDB();
db.on('error',(error)=>{
    console.error('Error en la conexión de MongoDB: ',error);
});
db.once('open',()=>{
    console.log('Conexion a la base datos establecida');
});



app.use('/books',bookRoutes)

const port= process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Servidor Iniciado en el puerto ${port}`)
})