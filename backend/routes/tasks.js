const router = require('express').Router();
const Task = require('../models/Task');
const protect = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ status: 1, position: 1 });
  res.json({ success: true, count: tasks.length, data: tasks });
});

router.post('/', async (req, res) => {
  const { title, description, priority, status, dueDate, tags } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
  const count = await Task.countDocuments({ user: req.user._id, status: status || 'todo' });
  const task = await Task.create({ title, description, priority, status, dueDate, tags, user: req.user._id, position: count });
  res.status(201).json({ success: true, data: task });
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, data: task });
});

router.patch('/:id/move', async (req, res) => {
  const { status, position } = req.body;
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { status, position }, { new: true });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, data: task });
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, message: 'Task deleted' });
});

module.exports = router;
