import { BSON } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";
const exportDir = path.join(__dirname, "../data_export");

console.log("Connecting to MongoDB:", mongoUri);
await mongoose.connect(mongoUri);

const collections = ["categories", "bikes", "users", "orders", "reviews", "contacts"];
fs.mkdirSync(exportDir, { recursive: true });

for (const colName of collections) {
  const docs = await mongoose.connection.db.collection(colName).find().toArray();
  const jsonStr = BSON.EJSON.stringify(docs, { relaxed: false }, 2);
  const filePath = path.join(exportDir, `${colName}.json`);
  fs.writeFileSync(filePath, jsonStr, "utf8");
  console.log(`[SUCCESS] Exported ${docs.length} records from collection "${colName}"`);
}

await mongoose.disconnect();
console.log("Database export completed successfully to backend/data_export!");
