import * as luxon from 'luxon'
import express from 'express'
import { Product } from './components/product'
import { Member } from './components/member'
import { Cart } from './components/cart'
import { CartItem } from './components/cartItem'
import { AppError } from './app-error'
import { router } from './components/product-router/product-router'
const app = express()
const port = 3000

app.use(express.json())
app.use('/products', router)

/** 1 */
// GET /

// Return website information as JSON
// name, launchedDate, version (string), slogan, address
app.get('/', async (req, res) => {
    res.send({
        name: 'A&J',
        lauchedDate: luxon.DateTime.now().toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' }),
        version: '1.0',
        slogan: 'no money no honey',
        address: 'HCMC, VN'
    })
})


/** 8 */
// POST /register
const members: Member[] = []

let bim = new Member('Bim', '7 Feb', "Aus")
let nu = new Member('Nu', '7 Feb', "Aus")
addMember(bim)
addMember(nu)

function addMember(member: Member) {
    member.id = members.length + 1
    member.enabled = true;
    member.point = 0;
    member.joinedDate = luxon.DateTime.now();
    members.push(member)
}

app.post('/register', (req, res) => {
    const member = req.body
    addMember(member)
    res.send(member)
})

/** 9 */
// GET /users

// API to get list of users in the system
app.get('/users', (req, res) => {
    res.send(members)
})

/** 10 */
// PUT /users/{id}
// {
// 	name: "",
// 	birthday:"",
// 	homeAddress:""
// }
// API to update user detail. This API will find the user by given ID and update their info as sent by the client
app.put('/users/:id', (req, res) => {
    const userId: number = +req.params.id
    const foundIndex = members.findIndex((member) => member.id == userId)
    if (foundIndex >= 0) {
        members[foundIndex].name = req.body.name
        members[foundIndex].birthday = req.body.birthday
        members[foundIndex].homeAddress = req.body.homeAddress
        res.send(members[foundIndex])
    } else {
        res.status(404).json({ message: "User not found" })
    }
})

/** 12 */

// POST /cart
// {
// userId: 1,
// productId: 2,
// quantity: 3,
// note: "This is a note"
// }
// Write API to add a product to user cart.
// If user does not have cart, create a new cart. cart.user = (selected user)
// If user already have cart, update the cart to have selected item
const cartList: Cart[] = []

app.post('/cart', (req, res) => {
    const products: Product[] = []
    const userId = req.body.userId
    const productId = req.body.productId
    const foundCart = cartList.find((element) => element.user.id == userId)
    const foundProduct = products.find((product) => product.id == productId)

    if (foundCart) {
        let foundCartProduct = foundCart.cartItems.find((element) => element.product.id == productId)
        if (foundCartProduct) {
            foundCartProduct.note = req.body.note
            foundCartProduct.quantity = req.body.quantity

        } else {
            let newCartItem = new CartItem(foundProduct!, req.body.quantity, req.body.note)
            foundCart.cartItems.push(newCartItem)
        }
        foundCart.total += foundCart.countTotal()
        res.send(foundCart)
    } else {
        let newCartItems = [new CartItem(foundProduct!, req.body.quantity, req.body.note)]
        let user = members.find((user) => user.id == userId)
        let newCart = new Cart(user!, newCartItems, user?.homeAddress!)
        newCart.total = newCart.countTotal()
        cartList.push(newCart)
        res.send(newCart)
    }
})


// POST /checkout
// {
// 	userId: 1
// }
// Write API to start checkout a user's cart
// Clear user's cart and return the total amount the user have to pay
function preCheckout(cart: Cart): boolean {
    for (let i = 0; i < cart.cartItems.length; i++) {
        let quantity = cart.cartItems[i].quantity
        let availableQuantity = cart.cartItems[i].product.quantity
        if (quantity > availableQuantity) {
            return false
        } else {
            availableQuantity -= quantity
        }
    }
    return true
}

function appTryCatch(req: any, res: any, next: any, handler: Function) {
    try {
        return handler(req, res, next)
    } catch (err) {
        next(err)
    }
}

function handleCheckout(req: any, res: any, next: any) {
    const userId = req.body.userId
    const foundCartIndex = cartList.findIndex((element) => element.user.id == userId)
    const totalAmount = cartList[foundCartIndex].total

    if (foundCartIndex && preCheckout(cartList[foundCartIndex])) {
        cartList[foundCartIndex].paymentCompletedDate = luxon.DateTime.now()
        cartList.splice(foundCartIndex, 1)
        res.send("The total amount is " + totalAmount)
    } else {
        res.status(400)
    }
}

app.get('/checkout', (req, res, next) => appTryCatch(req, res, next, handleCheckout))


function appErrorHandler(err: Error, req: any, res: any, next: any) {
    if (err instanceof AppError) {
        res.status(err.status).json({
            message: err.message
        })
    } else {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        })
    }
}

app.use(appErrorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})

