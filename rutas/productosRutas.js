var rutaP = require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var { mostrarProductos, nuevoProducto, buscarPorIdP, modificarProducto, borrarProducto } = require("../bd/productosBD");

rutaP.get("/mostrarProductos", async (req, res) => {
    try {
        const prods = await mostrarProductos();
        console.log("Productos obtenidos:", prods);
        res.render("productos/mostrarP", { prods });
    } catch (error) {
        console.error("Error al mostrar productos:", error);
        res.status(500).send("Error al mostrar productos");
    }
});



rutaP.get("/nuevoProducto", (req, res) => {
    res.render("productos/nuevoP");
});

rutaP.post("/nuevoProducto", subirArchivo(), async (req, res) => {
    try {
        if (req.file) {
            req.body.foto = req.file.originalname;
        }
        const error = await nuevoProducto(req.body);
        res.redirect("/mostrarProductos");
    } catch (error) {
        console.error("Error al crear un nuevo producto:", error);
        res.status(500).send("Error al crear un nuevo producto");
    }
});


rutaP.post("/nuevoProducto", async (req, res) => {
    try {
        const error = await nuevoProducto(req.body);
        console.log(error);
        res.redirect("/mostrarProductos");
    } catch (error) {
        console.error("Error al crear un nuevo producto:", error);
        res.status(500).send("Error al crear un nuevo producto");
    }
});
rutaP.get("/editarProducto/:id", async (req, res) => {
    try {
        var product = await buscarPorIdP(req.params.id);
        res.render("productos/modificarP", { prod: product });
    } catch (error) {
        console.error("Error al obtener el producto para editar:", error);
        res.status(500).send("Error al editar el producto");
    }
});



rutaP.post("/editarProducto", async (req, res) => {
    var error = await modificarProducto(req.body);
    res.redirect("/mostrarProductos");
});

const fs = require("fs"); // Importa el módulo "fs"

rutaP.get("/borrarProducto/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        // Recupera la información del producto antes de borrarlo
        const product = await buscarPorIdP(productId);

        if (!product) {
            res.status(404).send("Producto no encontrado");
            return;
        }

        // Obtiene el nombre del archivo a eliminar (en este caso, la foto del producto)
        const archivoAEliminar = product.foto;

        // Elimina el archivo del sistema de archivos
        fs.unlink(`web/images/${archivoAEliminar}`, (error) => {
            if (error) {
                console.error("Error al eliminar el archivo: " + error);
            }
        });

        // Elimina el producto de la base de datos
        await borrarProducto(productId);

        res.redirect("/mostrarProductos");
    } catch (error) {
        console.error("Error al borrar el producto:", error);
        res.status(500).send("Error al borrar el producto");
    }
});


module.exports = rutaP;
