import express from 'express'

const router = express.Router()

import Project from '../../models/Project.js'
import { authMiddleware } from '../../utils/auth.js'
 
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// GET /api/projects - Get all projects for the logged-in user
router.get('/', async (req, res) => {
  console.log(req.user)
  // This currently finds all projects in the database.
  // It should only find projects owned by the logged in user.
  try {
    const projects = await Project.find({ user: req.user._id }).populate('user');
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      // The user ID in the database
      user: req.user._id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
// PUT /api/projects/:id - Update a project
router.put('/:id', async (req, res) => {
  try {
    // find the project first so we can check which user created it (ownership)
    const foundProject = await Project.findById(req.params.id)

    if (!foundProject) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }

    // compare the project's user id with the logged in user's id 
    // if they don't match, it's not our project and we shouldn't be able to update it 
    if (foundProject.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to update this project.' })
    }

    // This needs an authorization check
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
    try {
    // find the project first so we can check which user created it (ownership)
    const foundProject = await Project.findById(req.params.id)

    if (!foundProject) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }

    // compare the project's user id with the logged in user's id 
    // if they don't match, it's not our project and we shouldn't be able to delete it 
    if (foundProject.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to delete this project.' })
    }

    // This needs an authorization check
    const project = await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'project deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
export default router