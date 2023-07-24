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
        const result = await db("users")

        res.status(200).send(result)
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//get all products (and products by name)
app.get("/products", async (req: Request, res: Response) => {
    try {
        const nameToFind = req.query.name as string
        if (nameToFind) {
            const result = await db("products")
                .select()
                .where("name", "LIKE", `%${nameToFind}%`)
            res.status(200).send(result)
        } else {
            const result = await db("products")
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

//create user
app.post('/users', async (req: Request, res: Response) => {
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

        const [userId] = await db("users").where({ id: id })
        if (userId) {
            res.status(409)
            throw new Error("'id' já cadastrado")
        }

        const [userEmail] = await db("users").where({ email: email })
        if (userEmail) {
            res.status(409)
            throw new Error("'e-mail' já cadastrado")
        }

        const newUser = {
            id: id,
            name: name,
            email: email,
            password: password,
            created_at: new Date().toISOString()
        }

        await db("users").insert(newUser)

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
        const [product] = await db.raw(`
        SELECT * FROM products
        WHERE id = "${id}";
        `)
        if (product) {
            res.status(409)
            throw new Error("'id' do produto já cadastrada")
        }

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
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const [user] = await db("users").where({ id: idToDelete })
        if (!user) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        await db("users").del().where({ id: idToDelete })

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
app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const [product] = await db("products").where({ id: idToDelete })
        if (!product) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        await db("products").del().where({ id: idToDelete })

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
        else {
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
        const result = await db("purchases")
        res.status(200).send(result)
    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// get purchases by id
app.get("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const idToFind = req.params.id as string
        if (idToFind) {
            const [purchase] = await db("purchases")
                .select(
                    "id AS purchaseId",
                    "buyer AS buyerId",
                    "total_price AS totalPrice",
                    "created_at AS createdAt"
                ).where({ id: idToFind })
            const [buyer] = await db("users").where({ id: purchase.buyerId })
            purchase.buyerName = buyer.name
            purchase.buyerEmail = buyer.email

            const purchasedProducts = await db("purchases_products").where({ purchase_id: idToFind })
            const productCompleteInfo = []
            for (let product of purchasedProducts) {
                const [productInfo] = await db("products").where({ id: product.product_id })
                productCompleteInfo.push({ ...productInfo, quantity: product.quantity })
            }

            const resultArray = []
            resultArray.push({ ...purchase, products: productCompleteInfo })
            const result = resultArray[0]

            res.status(200).send(result)
        }
        else {
            const result = await db("purchases")
            res.status(200).send(result)
        }

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// create purchase
app.post('/purchases', async (req: Request, res: Response) => {
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

        const [purchase] = await db.raw(`
        SELECT * FROM purchases
		WHERE id = "${id}";
		`)
        if (purchase) {
            res.status(409)
            throw new Error("'id' já cadastrado")
        }

        let newProducts = []
        let total: number = 0

        for (let product of products) {
            const [prod] = await db.raw(`
	        SELECT * FROM products
            WHERE id = "${product.id}";
        `)
            newProducts.push({ ...prod, quantity: product.quantity })
        }

        for (let product of newProducts) {
            total += product.price * product.quantity
        }

        await db.raw(`
        INSERT INTO purchases (id, buyer, total_price, created_at)
        VALUES ("${id}", "${buyer}", "${total}", "${new Date().toISOString()}");
    `)
        for (let product of products) {
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

        const [purchase] = await db.raw(`
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
        res.status(200).send({ message: "Purchase deletada com sucesso" })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})