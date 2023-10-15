var ruta = require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var {mostrarUsuarios, nuevousuario, buscarPorId, modificarUsuario,borrarUsuario } = require("../bd/usuariosBD");

ruta.get("/", async (req, res) => {
    var users = await mostrarUsuarios();
    //console.log(users);
    res.render("usuarios/mostrar", {users});
})
ruta.get("/nuevousuario",(req,res)=>{
    res.render("usuarios/nuevo");
}); 

ruta.post("/nuevousuario",subirArchivo(),async (req,res)=>{
    //console.log(req.file.originalname);
    req.body.foto=req.file.originalname;
    //console.log(req.body);
    //res.end();
    var error= await nuevousuario(req.body);
    res.redirect("/"); 
}); 

ruta.get("/editarUsuario/:id", async (req, res) => {
    var user = await buscarPorId(req.params.id);
    res.render("usuarios/modificar", { user });
});


ruta.post("/editarUsuario", async (req,res)=>{
    var error=  await modificarUsuario(req.body);
    res.redirect("/");
});

const fs = require("fs"); // Importa el módulo "fs"

ruta.get("/borrarUsuario/:id", async (req, res) => {
    const userId = req.params.id;
    
    // Recupera la información del usuario antes de borrarlo
    const user = await buscarPorId(userId);

    if (!user) {
        res.status(404).send("Usuario no encontrado");
        return;
    }

    // Obtiene el nombre del archivo a eliminar (en este caso, la foto de perfil)
    const archivoAEliminar = user.foto;

    // Elimina el archivo del sistema de archivos
    fs.unlink(`web/images/${archivoAEliminar}`, (error) => {
        if (error) {
            console.error("Error al eliminar el archivo: " + error);
        }
    });

    // Elimina el usuario de la base de datos
    await borrarUsuario(userId);

    res.redirect("/");
});



module.exports = ruta;