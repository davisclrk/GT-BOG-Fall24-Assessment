import AWS from "aws-sdk";
import fs from "fs";
import multer from "multer";
import User from "../models/user.js";
import Animal from "../models/animal.js";
import TrainingLog from "../models/trainingLog.js";
import { updateUserProfilePicture } from "./userController.js";
import { updateAnimalProfilePicture } from "./animalController.js";
import { updateTrainingLogVideo } from "./trainingLogController.js";

const upload = multer({ dest: "uploads/" });

export const uploadFile = async (req, res) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: "us-east-2"
    });
    const bucketName = "bog-f24assessment-uploads";

    const file = req.file;
    const type = req.body.type;
    const id = req.body.id;

    if (!file) {
        return res.status(500).send("File is required!");
    }

    const fileStream = fs.createReadStream(file.path);

    fileStream.on("error", (err) => {
        fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
        });
        return res.status(500).send("Error reading the file!");
    });

    let name;
    try {
        if (type === "user") {
            const dbUser = await User.exists({ _id: id });
            if (!dbUser) {
                return res.status(500).send("User does not exist!");
            }
            if (req.user.id !== id) {
                return res.status(500).send("You are not authorized to upload files for this user!");
            }
            if (file.mimetype.substr(0, 5) !== "image") {
                return res.status(500).send("Wrong file type!");
            }
            name = "user";
        } else if (type === "animal") {
            const dbAnimal = await Animal.findById(id);
            if (!dbAnimal) {
                return res.status(500).send("Animal does not exist!");
            }
            if (req.user.id !== dbAnimal.owner) {
                return res.status(500).send("You are not authorized to upload files for this animal!");
            }
            if (file.mimetype.substr(0, 5) !== "image") {
                return res.status(500).send("Wrong file type!");
            }
            name = "animal";
        } else if (type === "training") {
            const dbTrainingLog = await TrainingLog.findById(id);
            if (!dbTrainingLog) {
                return res.status(500).send("Training log does not exist!");
            }
            if (req.user.id !== dbTrainingLog.user) {
                return res.status(500).send("You are not authorized to upload files for this training log!");
            }
            if (file.mimetype.substr(0, 5) !== "video") { 
                return res.status(500).send("Wrong file type!");
            }
            name = "training";
        } else {
            return res.status(500).send("Invalid type!");
        }
    } catch (error) {
        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting temp file:", err);
        });
        return res.status(500).send("Error checking database! Check type and ID values");
    }

    name += id + '-' + file.originalname;

    const params = {
        Bucket: bucketName,
        Key: name,
        Body: fileStream,
        ContentType: file.mimetype,
    };

    try {
        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(500).send("Error uploading the file!");
            }
            res.status(200).send("File uploaded successfully.");

            fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });

            if (type === "user") {
                updateUserProfilePicture(id, data.Location);
            } else if (type === "animal") {
                updateAnimalProfilePicture(id, data.Location);
            } else {
                updateTrainingLogVideo(id, data.Location);
            }
        });
    } catch (error) {
        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting temp file:", err);
        });
        res.status(500).send("Error uploading the file!");
    }
};

export const uploadMiddleware = upload.single("file");