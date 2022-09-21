const express = require("express");
const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");

const photoSchema = mongoose.Schema({
    albumId: {
        type: Number,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
});
const Photo = mongoose.model("photo", photoSchema);

mongoose.connect("mongodb://localhost/cs3219-task-e", { useNewUrlParser: true });
const db = mongoose.connection;
// Bind connection to error event to get notification of connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Populate local db with photos from external api
axios.get("http://jsonplaceholder.typicode.com/photos").then((res) => {
    res.data.forEach((photo) => {
        const mongoosePhoto = new Photo();
        mongoosePhoto.albumId = photo.albumId;
        mongoosePhoto.id = photo.id;
        mongoosePhoto.title = photo.title;
        mongoosePhoto.url = photo.url;
        mongoosePhoto.thumbnailUrl = photo.thumbnailUrl;
        mongoosePhoto.save();
    });
});

const port = 8000;
const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("Redis cache with Express and Mongoose"));

router.get("/", (req, res) => {
    res.json({
        message: "CS3219 OTOT Task E",
    });
});
router.get("/photos", (req, res) => {
    Photo.find((err, photos) => {
        if (err) return res.send(err);

        res.json({
            message: "Photos retrieved successfully",
            data: photos,
        });
    });
});
app.use("/api", router);

module.exports = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
