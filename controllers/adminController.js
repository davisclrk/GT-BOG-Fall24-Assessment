import mongoose from "mongoose";
import User from "../models/user.js";
import Animal from "../models/animal.js";
import TrainingLog from "../models/trainingLog.js";

export const getUsers = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({}, '-password')
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);

        const hasNextPage = await User.countDocuments() > skip + limit;

        res.status(200).json({
            users,
            hasNextPage,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while getting users! " + error.message });
    }
};

export const getAnimals = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const animals = await Animal.find({})
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);

        const hasNextPage = await Animal.countDocuments() > skip + limit;

        res.status(200).json({
            animals,
            hasNextPage,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while getting animals! " + error.message });
    }
};

export const getTrainingLogs = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const trainings = await TrainingLog.find({})
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);

        const hasNextPage = await TrainingLog.countDocuments() > skip + limit;

        res.status(200).json({
            trainings,
            hasNextPage,
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while getting training logs! " + error.message });
    }
};