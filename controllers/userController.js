import User from "../models/user.js";

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, profilePicture } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Request body missing fields!" });
        }

        if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string' || (profilePicture && typeof profilePicture !== 'string')){
            return res.status(400).json({ message: "Invalid data type in request body!" });
        }

        const userExists = await User.exists({ email: email }).exec();
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists!" });
        }

        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong! " + error.message });
    }
};