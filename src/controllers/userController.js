const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;
  try {
    const data = {};
    if (name) data.name = name;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, name: true, email: true }
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};