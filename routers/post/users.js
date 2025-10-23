const Database = require('../../src/Database/mainDatabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async function createUser(req, res) {
  try {
    const { name, email, telefone, role, password } = req.body.data;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Dados invalidos: Forneça {name} {email} e {password} pelo menos.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(req.body.data);
    console.log(hashedPassword)

    const result = await Database.query(
      'INSERT INTO Users (name, email, password, telefone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, telefone || null, role || 'client']
    );

    
    const userId = result.insertId;
//Por algum motivo o process.env não está funcionando aqui
  
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_TOKEN || "chavedeAssisnaturaRefres",
      { expiresIn: '25m' }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESHTK || "chavedeAssinaturaRefres",
      { expiresIn: '7d' }
    );
    
    await Database.query('UPDATE Users SET refreshToken = ? WHERE id = ?', [refreshToken, userId])


    //cabe ao gateway enviar res.cookie para o cliente, mas podemos testar.

    return res.status(201).json({
      message: 'Usuário criado com sucesso!',
      token,
      refreshToken,
      userId
    });

  } catch (err) {
    console.error('[500] Erro ao criar usuário:', err.message);
    console.log(err);
    return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
  }
};