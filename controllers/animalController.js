import mongoose from "mongoose";
import Animal from "../models/animal.js";
import User from "../models/user.js";

export const createAnimal = async (req, res) => {
    try {
        const { name, hoursTrained, owner, dateOfBirth, profilePicture } = req.body;

        if (!name || !hoursTrained || !owner) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof name !== 'string' || typeof hoursTrained !== 'number' || !(mongoose.Types.ObjectId.isValid(owner)) || (dateOfBirth && dateOfBirth instanceof Date && !isNaN(dateOfBirth.valueOf())) || (profilePicture && typeof profilePicture !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const ownerExists = await User.exists({ _id: owner }).exec();
        if (!ownerExists) {
            return res.status(400).json({ message: "Owner with this ID does not exist!" });
        }

        const animal = await Animal.create(req.body);
        res.status(200).json(animal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while creating animal! " + error.message });
    }
};