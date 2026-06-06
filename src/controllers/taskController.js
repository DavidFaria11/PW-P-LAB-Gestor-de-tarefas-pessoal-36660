const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTasks = async (req, res) => {
  const { category, priority, status } = req.query;
  const where = { userId: req.userId };
  if (category) where.category = category;
  if (priority) where.priority = priority;
  if (status) where.status = status;

  const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, category, priority, deadline, time } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title, description, category,
        priority: priority || 'media',
        deadline: deadline ? new Date(deadline) : null,
        time: time || null,
        userId: req.userId
      }
    });
    res.status(201).json(task);
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ error: 'Erro ao criar tarefa' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({ where: { id: Number(id), userId: req.userId } });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: req.body
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: 'Erro ao atualizar tarefa' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({ where: { id: Number(id), userId: req.userId } });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Tarefa eliminada' });
  } catch (e) {
    res.status(400).json({ error: 'Erro ao eliminar tarefa' });
  }
};

exports.getStats = async (req, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.userId } });

  const total = tasks.length;
  const concluidas = tasks.filter(t => t.status === 'concluida').length;
  const pendentes = tasks.filter(t => t.status === 'ativa').length;

  const porCategoria = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  res.json({ total, concluidas, pendentes, porCategoria });
};