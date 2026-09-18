const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks belonging to the logged-in user
//          Supports optional query params:
//            status   - 'pending' | 'in-progress' | 'completed'
//            priority - 'low' | 'medium' | 'high'
//            search   - matches against title OR description (case-insensitive)
//            sortBy   - 'deadline' | 'priority' | 'title' | default: newest first
// @route   GET /api/tasks
// @access  Private
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sortBy } = req.query;

  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search && search.trim()) {
    // Escape regex special characters so a raw search string can't break
    // or hijack the query (e.g. someone typing "(" or ".*").
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  let query = Task.find(filter);

  // Deadline, title, and createdAt sort naturally at the database level.
  // Priority does not (alphabetically "high" < "low" < "medium", which is
  // meaningless), so it's sorted in memory below using a real weight order.
  switch (sortBy) {
    case 'deadline':
      query = query.sort({ deadline: 1 });
      break;
    case 'title':
      query = query.sort({ title: 1 });
      break;
    case 'priority':
      break;
    default:
      query = query.sort({ createdAt: -1 });
  }

  let tasks = await query;

  if (sortBy === 'priority') {
    tasks = tasks.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  }

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Get a single task by id (only if it belongs to the user)
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Create a new task for the logged-in user
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { title, description, status, priority, deadline } = req.body;

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    deadline,
  });

  res.status(201).json({ success: true, data: task });
});

// @desc    Update a task (only if it belongs to the user)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const allowedUpdates = ['title', 'description', 'status', 'priority', 'deadline'];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  // Automatically stamp completedAt when a task transitions to completed
  if (req.body.status === 'completed' && task.completedAt === null) {
    task.completedAt = new Date();
  } else if (req.body.status && req.body.status !== 'completed') {
    task.completedAt = null;
  }

  await task.save();

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete a task (only if it belongs to the user)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
