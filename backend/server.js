const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static images from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// MongoDB connection
const mongoUrl = "mongodb://localhost:27017/uploadFiles";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to database");
})
.catch((err) => {
  console.error("Database connection error:", err);
});

// Define the ImageDetails schema and model
const ImageDetailsSchema = new mongoose.Schema({
  image: String
}, { collection: "ImageDetails" });

const Images = mongoose.model("ImageDetails", ImageDetailsSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload image endpoint
app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const imageName = req.file.filename;

  try {
    await Images.create({ image: imageName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

// Get all images endpoint
app.get("/get-image", async (req, res) => {
  try {
    const data = await Images.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// Default route
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(9000, () => {
  console.log("Server Started");
});
