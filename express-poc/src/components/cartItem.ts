// CartItem is a class that describe each item in a cart. CartItem should
// have properties: product, quantity, note

import { Product } from "./product";

export class CartItem {
    product: Product
    quantity: number
    note: string
    constructor(product: Product, quantity: number, note: string) {
        this.product = product
        this.quantity = quantity
        this.note = note
    }
}