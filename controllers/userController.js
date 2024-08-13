import User from "../models/user.js";
import bcrypt from 'bcrypt';

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
        console.log(error);
        res.status(500).json({ message: "Something went wrong while creating user! " + error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Request body missing fields!" });
    }

    if (typeof email !== 'string' || typeof password !== 'string'){
        return res.status(400).json({ message: "Invalid data type in request body!" });
    }

    const dbUser = await User.findOne({ email: email });
    if (!dbUser) {
        return res.status(403).json({ message: "Invalid email or password!" });
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password);
    if (!passwordMatch) {
        return res.status(403).json({ message: "Invalid email or password!" });
    }
    return res.status(200).json({ message: "Login successful!" });
};