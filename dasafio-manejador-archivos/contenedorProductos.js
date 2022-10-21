const { ALL } = require("dns");
const fs = require("fs");

class Contenedor {
    constructor(name) {
        this.filename = name;
    }
    async save(product) {
        try {
            if (fs.existsSync(this.filename)) {
                const productos = await this.getAll();
                if (productos.length > 0) {
                    //agregar un producto adicional
                    const lastId = productos[productos.length - 1].id + 1;
                    product.id = lastId;
                    productos.push(product);
                    await fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2));
                } else {
                    //agregamos un primer producto
                    product.id = 1;
                    await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
                }
            } else {
                product.id = 1;
                await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
            }
        } catch (error) {
            return "El producto no pudo ser guardado";
        }
    }

    async getAll() {
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf-8");
            if (contenido.length > 0) {
                const productos = JSON.parse(contenido);
                return productos;
            } else {
                return [];
            }
        } catch (error) {
            return "El archivo no se puede ser leido";
        }
    }

    async getById(id) {
        try {
            //obtener los productos.
            const productos = await this.getAll();
            //buscar producto por el id
            const producto = productos.find(elemento => elemento.id === id);
            return producto;
        } catch (error) {
            return "El producto no se encuentra";
        }
    }

    //   async deleteAll() {
    //       if (productos.length > 0) {
    //            const borrarProducto = product.push
    //           console.log("carrito borrarProducto", borrarProducto)
    //       } else {
    //           return "El elemento no puede ser eliminado"
    //       }
    //   }

    async deleteById(id) {
        //[1,2,3,4,5].
        //[1,2,4,5]
        try {
            const productos = await this.getAll();
            const newProducts = productos.filter(elemento => elemento.id !== id);
            await fs.promises.writeFile(this.filename, JSON.stringify(newProducts, null, 2));
            return `El producto con el id ${id} fue elimnado`;
        } catch (error) {
            return "El elemento no puede ser eliminado"
        }
    }

    getName() {
        return this.filename;
    }
}

const producto1 = {
    title: "Bicicleta BMX",
    price: 5000,
    thumbnail: "https://d3ugyf2ht6aenh.cloudfront.net/stores/139/501/products/7024754d-cf69-4512-bfc3-c3ec2be6cb82-e4330688d73ab0b5cc16516083620033-480-0.jpg"
}
const producto2 = {
    title: "Bicicleta mountain bike",
    price: 6000,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_785392-MLA49762584558_042022-V.webp"
}

const manejadorProductos = new Contenedor("productos.txt");
console.log(manejadorProductos);

const getData = async() => {
    //guardar un producto
    await manejadorProductos.save(producto1);
    await manejadorProductos.save(producto2);
    //cargar los productos
    const productos = await manejadorProductos.getAll();
    console.log("productos", productos);
    //buscar un producto
    const productoEncontrado = await manejadorProductos.getById(2);
    console.log("producto encontrado>", productoEncontrado);
    //eliminar un producto
    await manejadorProductos.deleteById(3);
    await manejadorProductos.deleteAll()


}
getData();