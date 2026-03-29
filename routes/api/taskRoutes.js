import express from 'express'

const router = express.Router()

import Task from '../../models/Task.js'
import { authMiddleware } from '../../utils/auth.js'
import Project from '../../models/Project.js'
 
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// GET /api/projects/:projectId/tasks - Get all tasks belong a projectId for the logged-in user
router.get('/:projectId/tasks', async (req, res) => {
  console.log(req.user)
  // This currently finds all tasks belong a projectId in the database.
  // It should only find task owned by the logged in user.
  try {
    const { projectId } = req.params

    // verify ownership
    const project = await Project.findOne({
        _id: projectId,
        owner: req.user.id
    })

    if(!project){
        return res.status(403).json({message: 'Unauthorized'})
    }
    // get tasks
    const tasks = await Task.find({ project: projectId}).populate('project');
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/projects/:projectId/tasks - Create a new task
router.post('/:projectId/tasks', async (req, res) => {
  try {
    const { projectId} = req.params

    // check ownership 
    const project = await Project.findOne({
        _id: projectId,
        owner: req.user.id
    })

    if(!project){
        return res.status(403).json({message: 'Unauthorized'})
    }

    // create a task
    const task = await Task.create({
      ...req.body,
      // The project ID in the user
      project: projectId
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
// PUT /api/tasks/:taskId - Update a task
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params

    // find the task first so we can check which user created it (ownership)
    const foundTask = await Task.findById(taskId)

    if (!foundTask) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }
    // find parent project
    const project = await Project.findById(foundTask.project)

    // verify ownership
    if(!project || project.owner.toString() !== reportError.user.id){
        res.status(403).json({message: 'Unauthorized'})
    }

    // This needs an authorization check
    const updateTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    
    res.json(updateTask);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/tasks/:taskId - Delete a task
router.delete('/:taskId', async (req, res) => {
    try {
     const { taskId } = req.params

    // find the task first so we can check which user created it (ownership)
    const foundTask = await Task.findById(taskId)

    if (!foundTask) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }
    // find parent project
    const project = await Project.findById(foundTask.project)

    // verify ownership
    if(!project || project.owner.toString() !== reportError.user.id){
        res.status(403).json({message: 'Unauthorized'})
    }

    // Delete task
    await Task.deleteOne();
    
    res.json({ message: 'task deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
export default router