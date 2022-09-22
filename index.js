const express = require("express");
const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");
const Redis = require("redis");
const redisClient = Redis.createClient();
redisClient.connect().then(() => console.log("Redis ready"));

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
Photo.deleteMany({}, () => {
    console.log("Cleared local db");
});

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
    console.log("Added 5000 photos to local db");
});

const port = 8000;
const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("Redis cache with Express and Mongoose"));
app.use("/api/photos", async (req, res) => {
    const photos = await redisClient.get("photos");
    if (photos) {
        res.json(JSON.parse(photos));
    } else {
        const data = await Photo.find({});
        redisClient.setEx("photos", 3600, JSON.stringify(data));
        res.json(data);
    }
});

module.exports = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
