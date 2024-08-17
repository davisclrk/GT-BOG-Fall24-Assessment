import mongoose from "mongoose";
import Animal from "../models/animal.js";
import User from "../models/user.js";

export const createAnimal = async (req, res) => {
    try {
        const { name, hoursTrained, dateOfBirth, profilePicture } = req.body;
        const ownerId = req.user.id;

        if (!name || !hoursTrained || !ownerId) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof name !== 'string' || typeof hoursTrained !== 'number' || (dateOfBirth && dateOfBirth instanceof Date && !isNaN(dateOfBirth.valueOf())) || (profilePicture && typeof profilePicture !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const ownerExists = await User.exists({ _id: ownerId });
        if (!ownerExists) {
            return res.status(400).json({ message: "Owner with this ID does not exist!" });
        }

        const animal = await Animal.create({ ...req.body, owner: ownerId });
        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating animal! " + error.message });
    }
};