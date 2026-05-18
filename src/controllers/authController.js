const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });
    res.status(201).json({ message: 'Utilizador criado', userId: user.id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Email já existe' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Password incorreta' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ error: 'Email já existe' });
  }
};