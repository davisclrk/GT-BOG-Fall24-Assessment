import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, profilePicture } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string' || (profilePicture && typeof profilePicture !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const userExists = await User.exists({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists!" });
        }

        const salt = 10;
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ ...req.body, password: encryptedPassword });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating user! " + error.message });
    }
};

const login = async (email, password) => {
    try {
        const dbUser = await User.findOne({ email: email });
        if (!dbUser) {
            throw new AuthError("Invalid email or password!");
        }

        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
            throw new AuthError("Invalid email or password!");
        }

        return dbUser;
    } catch (error) {
        console.log("Could not log in!");
        throw error;
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof email !== 'string' || typeof password !== 'string'){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        await login(email, password);
        return res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: "Something went wrong while logging in! " + error.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof email !== 'string' || typeof password !== 'string'){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const dbUser = await login(email, password);
        const user = { id: dbUser._id, email: dbUser.email };
        const token = jwt.sign(user, process.env.JWT_STRING, { expiresIn: "5m" });
        return res.status(200).json(token);
    } catch (error) {
        if (error instanceof AuthError) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: "Something went wrong while logging in! " + error.message });
    }
};

export const updateUserProfilePicture = async (id, profilePicture) => {
    try {
        const update = { profilePicture: profilePicture };
        await User.updateOne({ _id: id }, update);
    } catch (error) {
        console.log("Could not update user profile picture!");
        throw error;
    }
};

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }
};