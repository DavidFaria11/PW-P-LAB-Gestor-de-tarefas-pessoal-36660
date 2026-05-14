const router = require('express').Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask, getStats } = require('../controllers/taskController');

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/stats', getStats);

module.exports = router;