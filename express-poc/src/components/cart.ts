/** 11 */
import * as luxon from 'luxon'
import { CartItem } from "./cartItem";
import { Member } from "./member";

// A member can add a product to their cart. Cart is a class has properties:
// user, cartItems (cartItems is a list of cartItem), total, paymentCompletedDate, deliveryAddress.


export class Cart {
    user: Member
    cartItems: CartItem[]
    total: number
    paymentCompletedDate: luxon.DateTime | undefined
    deliveryAddress: string

    constructor(user: Member, cartItems: CartItem[], deliveryAddress: string) {
        this.user = user
        this.cartItems = cartItems
        this.deliveryAddress = deliveryAddress
        this.total = 0
    }

    public countTotal(): number {
        for (let i = 0; i < this.cartItems.length; i++) {
            this.total = this.cartItems[i].quantity * this.cartItems[i].product.price
        }
        return this.total;
    }
}