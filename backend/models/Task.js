const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['todo', 'inprogress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  position: { type: Number, default: 0 },
  dueDate: { type: Date },
  tags: [{ type: String, trim: true, maxlength: 30 }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

taskSchema.index({ user: 1, status: 1, position: 1 });

module.exports = mongoose.model('Task', taskSchema);
