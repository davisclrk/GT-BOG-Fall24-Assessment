import AWS from "aws-sdk";
import fs from "fs";
import multer from "multer";

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
        return res.status(500).send("Error reading the file!");
    });

    let name;
    if (type === "user") {
        name = "user";
    } else if (type === "animal") {
        name = "animal";
    } else if (type === "training") {
        name = "training";
    } else {
        return res.status(500).send("Invalid type!");
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
            res.status(200).send("File uploaded successfully. Location: ${data.Location}");

            fs.unlink(file.path, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
        });
    } catch (error) {
        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting temp file:", err);
        });
        res.status(500).send("Error uploading the file!");
    }
};

export const uploadMiddleware = upload.single("file");