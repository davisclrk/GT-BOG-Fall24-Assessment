import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    hoursTrained: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    }
});

const Animal = mongoose.model("Animal", animalSchema);
export default Animal;