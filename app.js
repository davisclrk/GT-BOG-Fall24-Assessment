import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/user.js';
import Animal from './models/animal.js';
import TrainingLog from './models/trainingLog.js';

dotenv.config();
const app = express();
const APP_PORT = 5001;

app.use(cors({ origin: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.json({"Hello": "World",
            "Version": 2})
});

app.get('/api/health', (req, res) => {
    res.json({"healthy": true})
});

app.post('/api/user', async (req, res) => {
    try {
        const { firstName, lastName, email, password, profilePicture } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string' || (profilePicture && typeof profilePicture !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong! " + error.message });
    }
});

app.post('/api/animal', async (req, res) => {
    try {
        const { name, hoursTrained, owner, dateOfBirth, profilePicture } = req.body;

        if (!name || !hoursTrained || !owner) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof name !== 'string' || typeof hoursTrained !== 'number' || !(mongoose.Types.ObjectId.isValid(owner)) || (dateOfBirth && dateOfBirth instanceof Date && !isNaN(dateOfBirth.valueOf())) || (profilePicture && typeof profilePicture !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const animal = await Animal.create(req.body);
        res.status(200).json(animal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong! " + error.message });
    }
});

app.post('/api/training', async (req, res) => {
    try {
        const { date, description, hours, animal, user, trainingLogVideo } = req.body;

        if (!date || !description || !hours || !animal || !user) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if ((date instanceof Date && !isNaN(date.valueOf())) || typeof description !== 'string' || typeof hours !== 'number' || !(mongoose.Types.ObjectId.isValid(animal)) || !(mongoose.Types.ObjectId.isValid(user)) || (trainingLogVideo && typeof trainingLogVideo !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }


        const trainingLog = await TrainingLog.create(req.body);
        res.status(200).json(trainingLog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong! " + error.message });
    }
});


mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(APP_PORT, () => {
            console.log(`API listening at http://localhost:${APP_PORT}`)
        });
    })
    .catch(err => {
        console.log("Failed to connect to MongoDB", err);
    });