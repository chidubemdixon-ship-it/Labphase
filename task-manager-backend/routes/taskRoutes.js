const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require a logged-in user
router.use(protect);

// Title is required when creating a task, but optional on update — a
// partial update (e.g. the dashboard's one-click "mark complete" toggle,
// which only sends { status: 'completed' }) must not be rejected just
// because it didn't also resend the title.
const createValidationRules = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
];

const updateValidationRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('deadline')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
];

router.route('/').get(getTasks).post(createValidationRules, createTask);

router.route('/:id').get(getTask).put(updateValidationRules, updateTask).delete(deleteTask);

module.exports = router;