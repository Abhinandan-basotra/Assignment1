import express from 'express';
import { addTask, deleteTask, getAllTasks, getSingleTask, updateTask } from '../controllers/task.controllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/").get( isAuthenticated, getAllTasks);
router.route("/:id").get(isAuthenticated, getSingleTask);
router.route("/").post(isAuthenticated, addTask);
router.route("/:id").put(isAuthenticated, updateTask);
router.route("/:id").delete(isAuthenticated, deleteTask);

export default router