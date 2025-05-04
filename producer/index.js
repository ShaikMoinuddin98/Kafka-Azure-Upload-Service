require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { Kafka } = require("kafkajs");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Configure Kafka Producer
const kafka = new Kafka({ brokers: [`${process.env.KAFKA_BROKER}`] });
const producer = kafka.producer();

// Configure Multer for File Upload
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log("File uploaded:", req.file.path);
  try {
    // Read image and convert to Base64
    const imageBuffer = fs.readFileSync(req.file.path)
    const filename = req.file.originalname;;
    const base64Image = imageBuffer.toString("base64");
    const contentType = req.file.mimetype; // Extract Content-Type

    const message = {
      filename: filename,
      imageData: base64Image,
      contentType:  contentType
    };

    // Connect and send to Kafka
    await producer.connect();
    await producer.send({
      topic: `${process.env.KAFKA_TOPIC}`,
      messages: [{ value: JSON.stringify(message)  }],
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    res.json({ message: "Image sent to Kafka successfully" });
  } catch (error) {
    console.error("Error sending to Kafka:", error);
    res.status(500).json({ error: "Failed to send image" });
  }
});

app.listen(port, () => console.log(`Producer API running on http://localhost:${port}`));
