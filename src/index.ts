import { users, products,createUser, getAllUsers, createProduct, getAllProducts, searchProductByName } from "./database"

createUser("u003", "Astrodev", "astrodev@email.com", "astrodev99")
getAllUsers()
createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.","https://picsum.photos/seed/Monitor/400")
getAllProducts()
searchProductByName(process.argv[2])