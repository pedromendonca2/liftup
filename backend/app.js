// backend/src/controllers/userController.js
const userService = require('./src/services/userService');

exports.createUser = async (req, res) => {
  try {
    // 1. Pega os dados do corpo da requisição
    const { email, password, name } = req.body;

    // 2. Chama o serviço para executar a lógica de negócio
    const newUser = await userService.createUser({ email, password, name });

    // 3. Envia a resposta de sucesso
    res.status(201).json(newUser);
  } catch (error) {
    // 4. Envia a resposta de erro
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
    // ... lógica para buscar usuário por ID ...
}