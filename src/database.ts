import exp from "constants"
import { Tuser } from "./types"
import { Tproducts } from "./types"

export const users: Tuser[] = [
    {
        id: "u001",
        name: "Fulano",
        email: "fulano@email.com",
        password: "fulano123",
        creatAt: new Date().toISOString()
    },
    {
        id: "u002",
        name: "Beltrana",
        email: "beltrana@email.com",
        password: "beltrana00",
        creatAt: new Date().toISOString()
    }
]
export const products: Tproducts[] = [
    {
        id: "prod001",
        name: "Mouse gamer",
        price: 250,
        description: "Melhor mouse do mercado!",
        imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400"
    },
    {
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400"
    }
]

export function createUser(id: string, name: string, email: string, password: string){
    const newUser:Tuser = {
        id: id,
        name: name,
        email: email,
        password: password,
        creatAt: new Date().toISOString()
    }
    users.push(newUser)
    console.log("Cadastro realizado com sucesso")
}

export function getAllUsers() {
    return users.map((user)=>{console.log(user)})
}

export function createProduct(id: string, name: string, price: number, description: string, imageUrl: string){
    const newProduct:Tproducts = {
        id: id,
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl
    }
    products.push(newProduct)
    console.log("Produto criado com sucesso")
}

export function getAllProducts() {
    return products.map((product)=>{console.log(product)})
}

export function searchProductByName(name: string) {
    products.filter((product)=>{
        if(product.name.toLowerCase().includes(name.toLowerCase())){
            console.log(product)
        }
    })
}