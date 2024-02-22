import express from "express";
import { Product } from "../product";
import { getDatabase } from "../database/database";

export const router = express.Router();

enum SQLCommands {
    COUNT_PRODUCT_LENGTH = 'SELECT COUNT(id) as pLength FROM product',
    GET_ENABLED_PRODUCTS = 'SELECT * FROM PRODUCT WHERE ENABLED = true'
}


async function addProduct(product: Product) {
    const db = await getDatabase()

    const productLengthResult = await db.query(SQLCommands.COUNT_PRODUCT_LENGTH)

    const productLength = Number(productLengthResult.rows[0].plength)

    db.end()
    return product

}

// GET /
router.get('/', async (req, res) => {
    const db = await getDatabase();
    const result = await db.query(SQLCommands.GET_ENABLED_PRODUCTS)


    db.end()
    res.json(result.rows)
})

// POST /
router.post('/', (req, res) => {
    const product = req.body
    addProduct(product)
    res.send(product)
})
const products: Product[] = []

/** 4 */
// DELETE /products/{id}
// Website can remove a product by given id out of products list
// DELETE /user
router.delete('/:id', (req, res) => {

    const productId: number = +req.params.id
    const foundProduct = products.find((product) => product.id == productId)
    if (foundProduct) {
        foundProduct.enabled = false;
        res.send(true)
    } else {
        res.status(404).end(false)
    }
})

/** 5 */
// GET /products/search/name/{name}

// Write method to search for product by name
// If product not found, return empty array
router.get('/search/name/:name', (req, res) => {
    const productName: string = req.params.name
    const result = products.filter((product) => product.name == productName && product.enabled == true)
    if (result) {
        res.send(result)
    } else {
        res.status(404).json({ message: "Products not found" })
    }
})

/** 6 */
// GET /products/search/category/{category}

// Write method to find products by category
router.get('/search/category/:category', (req, res) => {
    const productCategory: string = req.params.category
    const result = products.filter((product) => product.category == productCategory && product.enabled == true)
    if (result) {
        res.send(result)
    } else {
        res.status(404).json({ message: "Products by category not found" })
    }
})