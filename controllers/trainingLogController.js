import mongoose from "mongoose";
import TrainingLog from "../models/trainingLog.js";
import User from "../models/user.js";
import Animal from "../models/animal.js";

export const createTrainingLog = async (req, res) => {
    try {
        const { date, description, hours, animal, trainingLogVideo } = req.body;
        const ownerId = req.user.id;

        if (!date || !description || !hours || !animal || !ownerId) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if ((date instanceof Date && !isNaN(date.valueOf())) || typeof description !== 'string' || typeof hours !== 'number' || !(mongoose.Types.ObjectId.isValid(animal)) || (trainingLogVideo && typeof trainingLogVideo !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const ownerExists = await User.exists({ _id: ownerId });
        const animalExists = await Animal.exists({ _id: animal });
        if (!ownerExists || !animalExists) {
            return res.status(400).json({ message: "Owner or animal with the provided ID does not exist!" });
        }

        const dbAnimal = await Animal.findById(animal);

        if (dbAnimal.owner != ownerId) {
            return res.status(400).json({ message: "User is not the owner of the animal!" });
        }

        const trainingLog = await TrainingLog.create({ ...req.body, user: ownerId });
        res.status(200).json(trainingLog);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating training log! " + error.message });
    }
};

export const updateTrainingLogVideo = async (id, video) => {
    try {
        const update = { trainingLogVideo: video };
        await TrainingLog.updateOne({ _id: id }, update);
    } catch (error) {
        console.log("Could not update training log video!");
        throw error;
    }
};