"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductByName = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.products = exports.users = void 0;
exports.users = [
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
];
exports.products = [
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
];
function createUser(id, name, email, password) {
    const newUser = {
        id: id,
        name: name,
        email: email,
        password: password,
        creatAt: new Date().toISOString()
    };
    exports.users.push(newUser);
    console.log("Cadastro realizado com sucesso");
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users.map((user) => { console.log(user); });
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, description, imageUrl) {
    const newProduct = {
        id: id,
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl
    };
    exports.products.push(newProduct);
    console.log("Produto criado com sucesso");
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products.map((product) => { console.log(product); });
}
exports.getAllProducts = getAllProducts;
function searchProductByName(name) {
    exports.products.filter((product) => {
        if (product.name.toLowerCase().includes(name.toLowerCase())) {
            console.log(product);
        }
    });
}
exports.searchProductByName = searchProductByName;
