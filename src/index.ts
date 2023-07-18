import { users, products } from "./database"

import { db } from "./database/knex"

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
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
	        SELECT * FROM users;
        `)
        res.status(200).send(result)
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//get all products
app.get("/products", async (req: Request, res: Response) => {
    try {
        const nameToFind = req.query.name as string
    if (nameToFind) {
        // const result: Tproducts[] = products.filter(
        //     (product) => product.name.toLowerCase().includes(nameToFind.toLowerCase()))
        const result = await db.raw(`
	    SELECT * FROM products
        WHERE name LIKE "%${nameToFind}%";
        `)
        res.status(200).send(result)
    } else {
        const result = await db.raw(`
	        SELECT * FROM products;
        `)
        res.status(200).send(result)
    }
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
// app.get("/product", (req: Request, res: Response) => {
//     const nameToFind = req.query.name as string
//     if (nameToFind.length < 1) {
//         throw new Error("'Product name' deve possuir no mínimo 1 caractere")
//     }

//     if (nameToFind) {
//         const result: Tproducts[] = products.filter(
//             (product) => product.name.toLowerCase().includes(nameToFind.toLowerCase()))
//         res.status(200).send(result)
//     } else {
//         res.status(200).send(products)
//     }
// })

//create user
app.post('/users',  async (req: Request, res: Response) => {
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
        // const idExists = users.find((user) => user.id === id)
        // if (idExists) {
        //     res.statusCode = 409
        //     throw new Error("'id' já cadastrado")
        // }
        // const emailExists = users.find((user) => user.email === email)
        // if (emailExists) {
        //     res.statusCode = 409
        //     throw new Error("'e-mail' já cadastrado")
        // }

        const [ userId ] = await db.raw(`
        SELECT * FROM users
        WHERE id = "${id}";
        `)
        if (userId) {
        res.status(409)
        throw new Error("'id' já cadastrado")
        }
        const [ userEmail ] = await db.raw(`
        SELECT * FROM users
        WHERE email = "${email}";
        `)
        if (userEmail) {
        res.status(409)
        throw new Error("'e-mail' já cadastrado")
        }
    

        // const newUser: Tuser = {
        //     id,
        //     name,
        //     email,
        //     password,
        //     creatAt: new Date().toISOString()
        // }
        // users.push(newUser)

        await db.raw(`
        INSERT INTO users (id, name, email, password, created_at)
        VALUES ("${id}", "${name}", "${email}", "${password}", "${new Date().toISOString()}");
    `)

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
app.post('/products', async (req: Request, res: Response) => {
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
        const [ product ] = await db.raw(`
        SELECT * FROM products
        WHERE id = "${id}";
        `)
        if (product) {
        res.status(409)
        throw new Error("'id' do produto já cadastrada")
        }
    
        // const idExists = products.find((product) => product.id === id)
        // if (idExists) {
        //     res.statusCode = 409
        //     throw new Error("'id' do produto já cadastrada")
        // }

        // const newProduct: Tproducts = {
        //     id,
        //     name,
        //     price,
        //     description,
        //     imageUrl
        // }
        // products.push(newProduct)
        await db.raw(`
        INSERT INTO users (id, name, price, description, imageUrl)
        VALUES ("${id}", "${name}", ${price}, "${description}", "${imageUrl}");
    `)

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
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

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

        const [product] = await db.raw(`
        SELECT * FROM products
        WHERE id = "${idToEdit}";
        `)
        if (!product) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }
        else{
            await db.raw(`
            UPDATE products
            SET	
            id = "${newId || product.id}",
            name = "${newName || product.name}",
            price = "${isNaN(Number(newPrice)) ? product.price : newPrice as number}",
            description = "${newDescription || product.description}",
            image_url = "${newImageUrl || product.imageUrl}"
            WHERE id = "${idToEdit}";
            `)
        }
        res.status(200).send({ message: "Atualização realizada com sucesso" })

        // const idToEdit = req.params.id
        // const product = products.find((product) => product.id === idToEdit)
        // if (product) {
        //     product.id = newId || product.id
        //     product.name = newName || product.name
        //     product.price = isNaN(Number(newPrice)) ? product.price : newPrice as number
        //     product.description = newDescription || product.description
        //     product.imageUrl = newImageUrl || product.imageUrl
        // }
        // else {
        //     res.statusCode = 404
        //     throw new Error("'id' do produto não existe")
        // }
        // res.status(200).send("Produto atualizado com sucesso")
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// get all purchases
app.get("/purchases", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
	        SELECT * FROM purchases;
        `)
        res.status(200).send(result)
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// create purchase
app.post('/purchases',  async (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const buyer = req.body.buyer as string
        const products = req.body.products

        if (typeof id !== "string") {
            res.statusCode = 404
            throw new Error("'id' deve ser uma string")
        }
        if (typeof buyer !== "string") {
            res.statusCode = 404
            throw new Error("'buyer' deve ser uma string")
        }
        // if (typeof total_price !== "number") {
        //     res.statusCode = 404
        //     throw new Error("'total_price' deve ser um number")
        // }

        const [ purchase ] = await db.raw(`
        SELECT * FROM purchases
		WHERE id = "${id}";
		`)
        if (purchase) {
            res.status(409)
            throw new Error("'id' já cadastrado")
        }

        // const idExists = purchases.find((purchase) => purchase.id === id)
        // if (idExists) {
        //     res.statusCode = 409
        //     throw new Error("'id' já cadastrado")
        // }

        let newProducts = []
        let total : number = 0

        for (let product of products){
            const [prod] = await db.raw(`
	        SELECT * FROM products
            WHERE id = "${product.id}";
        `)
        newProducts.push({...prod, quantity: product.quantity })
        }

        for (let product of newProducts){
            total += product.price * product.quantity
        }
        
        await db.raw(`
        INSERT INTO purchases (id, buyer, total_price, created_at)
        VALUES ("${id}", "${buyer}", "${total}", "${new Date().toISOString()}");
    `)
    for (let product of products){
        await db.raw(`
        INSERT INTO purchases_products (purchase_id, product_id, quantity)
        VALUES ("${id}", "${product.id}", ${product.quantity});
    `)
    }
        res.status(201).send(`Pedido realizado com sucesso`)
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
}
)

//delete purchase by id
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        // const productIndex = products.findIndex((product) => product.id === idToDelete)
        const [ purchase ] = await db.raw(`
        SELECT * FROM purchases
        WHERE id = "${idToDelete}";
          `)

        if (!purchase) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }
        await db.raw(`
        DELETE FROM purchases
        WHERE id = "${idToDelete}";
        `)
        res.status(200).send({ message: "Purchase deletada com sucesso"})

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})