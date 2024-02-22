export class Product {
    name: string
    brand: string
    category: string
    price: number
    quantity: number
    id: number
    enabled: boolean = true;
    constructor(id: number, name: string, brand: string, category: string, price: number, quantity: number) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
    }
}
