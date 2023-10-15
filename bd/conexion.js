var admin=require("firebase-admin");
var keys=require("../serviceAcountKeys.json");
admin.initializeApp({
    credential:admin.credential.cert(keys)});
    
var cuenta = admin.firestore();//conexion a la cuenta 
//var conexion=cuenta.collection("ejemploBD")
var conexionUsuarios=cuenta.collection("Usuarios");//conexion a la bd 
var conexionProductos=cuenta.collection("Productos");//conexion a la bd 

module.exports={
    conexionUsuarios,
    conexionProductos
}