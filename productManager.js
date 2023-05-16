import fs from 'fs'

const path = './products.json'
export default class ProductManager {
    constructor(){
        this.products  = []
    }

    getProducts = async () =>{
        if(fs.existsSync(path)){
            const data = await fs.promises.readFile(path, 'utf-8')
            data === undefined ? data = [] : data
            const products = JSON.parse(data)
            return products
        } else {
            return []
        }
    }

    addProduct = async ({title, description, price, thumbnail, code, stock}) => {
        try {
            const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
            }

            const products = await this.getProducts()
            const newProdCode = product.code
            const existingCodes = new Set(products.map(producto => producto.code));
            
            if (existingCodes.has(newProdCode)) {
                throw new Error('Codigo de producto ya existente');
            }

            if(!title || !description || !price || !thumbnail || !code || !stock){  
                throw new Error('Faltan completar campos obligatorios')
            } else {
                
                function generateProductId(products) {
                    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
                }
                
                const productId = generateProductId(products);
                product.id = productId;
                
            }
            products.push(product)
            console.log(`se ha agregado ${product.title} exitosamente`)
            await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'))
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
        
    }

    getProductById = async (productId) => {
        try {
            const products = await this.getProducts()

            const product = products.find(product => product.id === productId);
        
            return product || null; 
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
        
    }

    updateProduct = async (productId, update) => {
        try {
          let products = await this.getProducts();
          let productIndex = products.findIndex((p) => p.id === productId);
      
          if (productIndex === -1) {
            return "elemento no encontrado";
          } else {
            products[productIndex] = { id: productId, ...update };
            await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
            return { id: productId, ...update };
          }
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }
      };

    deleteProduct = async (productId) => {
        try {
            const products = await this.getProducts()
            const product = await this.getProductById(productId)

            if(product === null){
                return 'elemento no encontrado'
            } else {
                products.splice([product], 1)
                await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'))
                return 'elemento eliminado'
            }
        } catch (error) {
            console.error(`Error:${error.message}`)
        }   
    }
}




