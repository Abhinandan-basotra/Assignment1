import { Task } from "../models/task.model.js";

export const getAllTasks = async (req, res) => {
    try {
        const { status, priority, sort } = req.query;
        let query = { userId: req.user.id };

        if (status) query.status = status;
        if (priority) query.priority = priority;

        let taskQuery = Task.find(query);

        if (sort === 'oldest') {
            taskQuery = taskQuery.sort({ createdAt: 1 });
        } else {
            taskQuery = taskQuery.sort({ createdAt: -1 });
        }

        const tasks = await taskQuery.exec();
        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getSingleTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const addTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Title is required' });
        }

        const sanitizedTitle = title.trim();
        const sanitizedDescription = description ? description.trim() : '';

        if (sanitizedTitle.length > 100) {
            return res.status(400).json({ success: false, error: 'Title cannot be more than 100 characters' });
        }

        if (sanitizedDescription.length > 500) {
            return res.status(400).json({ success: false, error: 'Description cannot be more than 500 characters' });
        }

        const validStatuses = ['todo', 'in-progress', 'completed'];
        const validPriorities = ['low', 'medium', 'high'];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ success: false, error: 'Invalid priority' });
        }

        const task = new Task({
            title: sanitizedTitle,
            description: sanitizedDescription,
            status: status || 'todo',
            priority: priority || 'medium',
            userId: req.user.id
        });

        await task.save();
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        console.error('Add task error:', error);
        res.status(400).json({ success: false, error: 'Failed to create task' });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;

        const updateData = {};

        if (title !== undefined) {
            if (!title || title.trim().length === 0) {
                return res.status(400).json({ success: false, error: 'Title cannot be empty' });
            }
            const sanitizedTitle = title.trim();
            if (sanitizedTitle.length > 100) {
                return res.status(400).json({ success: false, error: 'Title cannot be more than 100 characters' });
            }
            updateData.title = sanitizedTitle;
        }

        if (description !== undefined) {
            const sanitizedDescription = description ? description.trim() : '';
            if (sanitizedDescription.length > 500) {
                return res.status(400).json({ success: false, error: 'Description cannot be more than 500 characters' });
            }
            updateData.description = sanitizedDescription;
        }

        if (status !== undefined) {
            const validStatuses = ['todo', 'in-progress', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, error: 'Invalid status' });
            }
            updateData.status = status;
        }

        if (priority !== undefined) {
            const validPriorities = ['low', 'medium', 'high'];
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({ success: false, error: 'Invalid priority' });
            }
            updateData.priority = priority;
        }

        updateData.updatedAt = Date.now();

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.json({ success: true, data: task });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(400).json({ success: false, error: 'Failed to update task' });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted successfully', data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}