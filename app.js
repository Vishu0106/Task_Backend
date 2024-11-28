import express, { urlencoded } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import UserRoutes from './src/routes/user.routes.js';
import TaskRoutes from './src/routes/tasks.routes.js';

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/tasks', TaskRoutes)



export { app } 