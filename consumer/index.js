require("dotenv").config();
const { Kafka } = require("kafkajs");
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");

// Kafka configuration
const kafka = new Kafka({
  clientId: `${process.env.KAFKA_CLIENT_ID}`,
  brokers: [`${process.env.KAFKA_BROKER}`],
});

const consumer = kafka.consumer({ groupId: `${process.env.KAFKA_GROUP_ID}` });

// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING=process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER_NAME=process.env.AZURE_CONTAINER_NAME

// Initialize Azure Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function runConsumer() {
  await consumer.connect();
  console.log("Consumer connected to Kafka!");

  await consumer.subscribe({ topic: `${process.env.KAFKA_TOPIC}`, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        const { filename, contentType, imageData } = data;

        const imageBuffer = Buffer.from(imageData, "base64");
        const blockBlobClient = containerClient.getBlockBlobClient(filename);

        console.log(`Uploading ${filename} to Azure Blob Storage...`);

        // Upload the image buffer
        await blockBlobClient.uploadData(imageBuffer, {
          blobHTTPHeaders: { blobContentType: contentType }, // Set content type
        });

        console.log(`Image uploaded successfully! URL: ${blockBlobClient.url}`);
      } catch (error) {
        console.error("Error processing Kafka message:", error);
      }
    },
  });
}
runConsumer().catch(console.error);
