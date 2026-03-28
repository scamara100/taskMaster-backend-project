import 'dotenv/config'

import express from 'express'

import './config/connection.js'

import projectRoutes from './routes/api/projectRoutes.js'
import userRoutes from './routes/api/userRoutes.js'
import taskRoutes from './routes/api/taskRoutes.js'

// bring in cors
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 8081;
 
// configure cors as a middleware
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json());
 
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', taskRoutes);
 
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));