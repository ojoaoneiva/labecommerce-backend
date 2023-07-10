import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductByName } from "./database"

// createUser("u003", "Astrodev", "astrodev@email.com", "astrodev99")
// getAllUsers()
// createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.","https://picsum.photos/seed/Monitor/400")
// getAllProducts()
// searchProductByName(process.argv[2])

import express, { Request, Response } from "express"
import cors from "cors";
import { Tproducts, Tuser } from "./types";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});


app.get("/ping", (req: Request, res: Response) => {
    res.status(200).send("Pong!")
})

//get all users
app.get("/users", (req: Request, res: Response) => {
    try {
        res.status(200).send(users)
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//get all products
app.get("/products", (req: Request, res: Response) => {
    try {
        res.status(200).send(products)
    }
    catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//get products by name
app.get("/product", (req: Request, res: Response) => {
    const nameToFind = req.query.name as string
    if (nameToFind.length < 1) {
        throw new Error("'Product name' deve possuir no mínimo 1 caractere")
    }

    if (nameToFind) {
        const result: Tproducts[] = products.filter(
            (product) => product.name.toLowerCase().includes(nameToFind.toLowerCase()))
        res.status(200).send(result)
    } else {
        res.status(200).send(products)
    }
})

//create user
app.post('/users', (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const email = req.body.email as string
        const password = req.body.password as string

        if (typeof id !== "string") {
            res.statusCode = 404
            throw new Error("'id' deve ser uma string")
        }
        if (typeof name !== "string") {
            res.statusCode = 404
            throw new Error("'name' deve ser uma string")
        }
        if (typeof email !== "string") {
            res.statusCode = 404
            throw new Error("'email' deve ser uma string")
        }
        if (typeof password !== "string") {
            res.statusCode = 404
            throw new Error("'password' deve ser uma string")
        }
        const idExists = users.find((user) => user.id === id)
        if (idExists) {
            res.statusCode = 409
            throw new Error("'id' já cadastrado")
        }
        const emailExists = users.find((user) => user.email === email)
        if (emailExists) {
            res.statusCode = 409
            throw new Error("'e-mail' já cadastrado")
        }

        const newUser: Tuser = {
            id,
            name,
            email,
            password,
            creatAt: new Date().toISOString()
        }
        users.push(newUser)

        res.status(201).send("Cadastro realizado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
}
)

//create product
app.post('/products', (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const description = req.body.description as string
        const imageUrl = req.body.imageUrl as string

        if (typeof id !== "string") {
            res.statusCode = 404
            throw new Error("'id' deve ser uma string")
        }
        if (typeof name !== "string") {
            res.statusCode = 404
            throw new Error("'name' deve ser uma string")
        }
        if (typeof price !== "number") {
            res.statusCode = 404
            throw new Error("'price' deve ser um number")
        }
        if (typeof description !== "string") {
            res.statusCode = 404
            throw new Error("'description' deve ser uma string")
        }
        if (typeof imageUrl !== "string") {
            res.statusCode = 404
            throw new Error("'imageUrl' deve ser uma string")
        }
        const idExists = products.find((product) => product.id === id)
        if (idExists) {
            res.statusCode = 409
            throw new Error("'id' do produto já cadastrada")
        }

        const newProduct: Tproducts = {
            id,
            name,
            price,
            description,
            imageUrl
        }
        products.push(newProduct)

        res.status(201).send("Produto cadastrado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//delete user by id
app.delete('/users/:id', (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const userIndex = users.findIndex((user) => user.id === idToDelete)

        if (userIndex >= 0) {
            users.splice(userIndex, 1)
        }
        else {
            res.statusCode = 404
            throw new Error("'id' do usuário não existe")
        }
        res.status(200).send("User apagado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//delete product by id
app.delete('/products/:id', (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const productIndex = products.findIndex((product) => product.id === idToDelete)

        if (productIndex >= 0) {
            users.splice(productIndex, 1)
        }
        else {
            res.statusCode = 404
            throw new Error("'id' do produto não existe")
        }
        res.status(200).send("Produto apagado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//edit product by id
app.put('/products/:id', (req: Request, res: Response) => {
    try {
        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newDescription = req.body.description as string | undefined
        const newImageUrl = req.body.imageUrl as string | undefined

        if (typeof newId !== "string" && typeof newId !== "undefined") {
            res.statusCode = 404
            throw new Error("'id' deve ser uma string")
        }
        if (typeof newName !== "string" && typeof newName !== "undefined") {
            res.statusCode = 404
            throw new Error("'name' deve ser uma string")
        }
        if (typeof newPrice !== "number" && typeof newPrice !== "undefined") {
            res.statusCode = 404
            throw new Error("'price' deve ser um number")
        }
        if (typeof newDescription !== "string" && typeof newDescription !== "undefined") {
            res.statusCode = 404
            throw new Error("'description' deve ser uma string")
        }
        if (typeof newImageUrl !== "string" && typeof newImageUrl !== "undefined") {
            res.statusCode = 404
            throw new Error("'image url' deve ser uma string")
        }

        const idToEdit = req.params.id
        const product = products.find((product) => product.id === idToEdit)
        if (product) {
            product.id = newId || product.id
            product.name = newName || product.name
            product.price = isNaN(Number(newPrice)) ? product.price : newPrice as number
            product.description = newDescription || product.description
            product.imageUrl = newImageUrl || product.imageUrl
        }
        else {
            res.statusCode = 404
            throw new Error("'id' do produto não existe")
        }
        res.status(200).send("Produto atualizado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})