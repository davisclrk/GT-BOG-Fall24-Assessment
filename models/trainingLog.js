import mongoose from "mongoose";

const trainingLogSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    trainingLogVideo: {
        type: String,
        required: false
    }
});

const TrainingLog = mongoose.model("TrainingLog", trainingLogSchema);
export default TrainingLog;