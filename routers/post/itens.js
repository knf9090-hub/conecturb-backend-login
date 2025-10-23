const Database = require("../../src/Database/mainDatabase");

module.exports = async(req, res) => {

const {name, price, description, tags, storeid} = req.body.data;
if(!name || !price) return res.status(400).json({message: 'Os campos nome e price devem ser adicionados.'});
if(!storeid) return res.status(400).json({message: 'O campo storeId deve ser adicionado'});

try {
const response = Database.query('INSERT INTO storeItens (name, price, description, tags, storeId) VALUES (?,?,?,?,?);');

var itemId = response.insertId;

res.status(201).json({message: 'Item criado com sucesso!', itemId: itemId})
}catch(e){
res.status(500).json({message: 'Erro interno ao criar o item.'})
console.error(e);
}


}