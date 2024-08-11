import mongoose from "mongoose";
import TrainingLog from "../models/trainingLog.js";

export const createTrainingLog = async (req, res) => {
    try {
        const { date, description, hours, animal, user, trainingLogVideo } = req.body;

        if (!date || !description || !hours || !animal || !user) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if ((date instanceof Date && !isNaN(date.valueOf())) || typeof description !== 'string' || typeof hours !== 'number' || !(mongoose.Types.ObjectId.isValid(animal)) || !(mongoose.Types.ObjectId.isValid(user)) || (trainingLogVideo && typeof trainingLogVideo !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const ownerExists = await User.exists({ _id: user }).exec();
        const animalExists = await Animal.exists({ _id: animal }).exec();
        if (!ownerExists || !animalExists) {
            return res.status(400).json({ message: "Owner or animal with the provided ID does not exist!" });
        }

        const dbAnimal = await Animal.findById(animal).exec();

        if (dbAnimal.owner !== user) {
            return res.status(400).json({ message: "User is not the owner of the animal!" });
        }

        const trainingLog = await TrainingLog.create(req.body);
        res.status(200).json(trainingLog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong! " + error.message });
    }
};