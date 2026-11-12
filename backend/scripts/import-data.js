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

for (const colName of collections) {
  const filePath = path.join(exportDir, `${colName}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}, skipping...`);
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const docs = BSON.EJSON.parse(raw);

  const col = mongoose.connection.db.collection(colName);
  await col.deleteMany({});
  if (docs.length > 0) {
    await col.insertMany(docs);
  }
  console.log(`[SUCCESS] Imported ${docs.length} records into collection "${colName}"`);
}

await mongoose.disconnect();
console.log("Database import completed successfully!");
