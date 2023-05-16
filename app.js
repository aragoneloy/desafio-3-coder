import express from 'express'
import ProductManager from './productManager.js'



const app = express();
app.use(express.urlencoded({extended:true}))
const productManager = new ProductManager()

app.get('/products', async (req, res) => {
    try {
        const productData = await productManager.getProducts();
        const productDataLength = productData.length;
        let limit = Number(req.query.limit);
        console.log(limit)
            
        if (isNaN(limit)) {
            return res.json(productData)
        }
    
        if (limit > productDataLength) {
            return res.status(400).send('Limit is greater than the number of products');
        }
    
        if (limit < 0) {
            return res.status(400).send('Limit is less than zero');
        }
    
        const productDataLimit = productData.slice(0, limit);
        res.json(productDataLimit);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  });

app.get('/products/:pid', async (req, res) => {
    try {
        let productId = Number(req.params.pid)
        const productById = await productManager.getProductById(productId)
        res.json(productById)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})


app.listen(8080, ()=> console.log('Servidor escuchando en el puerto 8080'))