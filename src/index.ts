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
    res.status(200).send(users)
})

//get all products
app.get("/products", (req: Request, res: Response) => {
    res.status(200).send(products)
})

//get products by name
app.get("/product", (req: Request, res: Response) => {
    const nameToFind = req.query.name as string

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
    const id = req.body.id as string
    const name = req.body.name as string
    const email = req.body.email as string
    const password = req.body.password as string

    const newUser: Tuser = {
        id,
        name,
        email,
        password,
        creatAt: new Date().toISOString()
    }
    users.push(newUser)

    res.status(201).send("Cadastro realizado com sucesso")
})

//create product
app.post('/products', (req: Request, res: Response) => {
    const id = req.body.id as string
    const name = req.body.name as string
    const price = req.body.price as number
    const description = req.body.description as string
    const imageUrl = req.body.imageUrl as string

    const newProduct: Tproducts = {
        id,
        name,
        price,
        description,
        imageUrl
    }
    products.push(newProduct)

    res.status(201).send("Produto cadastrado com sucesso")
})

//delete user by id
app.delete('/users/:id', (req: Request, res: Response) => {
    const idToDelete = req.params.id

    const userIndex = users.findIndex((user) => user.id === idToDelete)

    if (userIndex >= 0) {
        users.splice(userIndex, 1)
    }
    res.status(200).send("User apagado com sucesso")
})

//delete product by id
app.delete('/products/:id', (req: Request, res: Response) => {
    const idToDelete = req.params.id

    const productIndex = products.findIndex((product) => product.id === idToDelete)

    if (productIndex >= 0) {
        users.splice(productIndex, 1)
    }
    res.status(200).send("Produto apagado com sucesso")
})

//edit product by id
app.put('/products/:id', (req: Request, res: Response) => {

    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDescription = req.body.description as string | undefined
    const newImageUrl = req.body.imageUrl as string | undefined

    const idToEdit = req.params.id
    const product = products.find((product) => product.id === idToEdit)
    if (product) {
        product.id = newId || product.id
        product.name = newName || product.name
        product.price = isNaN(Number(newPrice)) ? product.price : newPrice as number
        product.description = newDescription || product.description
        product.imageUrl = newImageUrl || product.imageUrl
    }
    res.status(200).send("Produto atualizado com sucesso")
})