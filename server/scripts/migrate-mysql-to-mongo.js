// One-off script: copies posts (and their image files) from the old MySQL database into MongoDB.
//
// Usage (from server/):
//   1. put MYSQL_URL and MONGODB_URI in server/.env
//   2. copy the old images into server/uploads/   (the old repo's back-end/uploads folder)
//   3. npm run migrate
// Safe to re-run - posts that were already copied are skipped.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import '../src/config/env.js';
import Post from '../src/models/Post.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

const run = async () => {
  if (!process.env.MYSQL_URL || !process.env.MONGODB_URI) {
    throw new Error('Set both MYSQL_URL and MONGODB_URI in server/.env');
  }

  const mysqlConn = await mysql.createConnection(process.env.MYSQL_URL);
  await mongoose.connect(process.env.MONGODB_URI);

  const [rows] = await mysqlConn.query('SELECT * FROM posts ORDER BY id');
  console.log(`Found ${rows.length} posts in MySQL`);

  let copied = 0;
  for (const row of rows) {
    const created_at = row.created_at ? new Date(row.created_at) : new Date();
    if (await Post.exists({ title: row.title, author: row.author, created_at })) continue;

    let image;
    if (row.image_url) {
      const file = path.join(__dirname, '..', row.image_url); // image_url looks like /uploads/123.jpg
      const ext = path.extname(file).toLowerCase();
      if (fs.existsSync(file) && mimeTypes[ext]) {
        image = { data: fs.readFileSync(file), contentType: mimeTypes[ext] };
      } else {
        console.warn(`  ! image not found for "${row.title}": ${row.image_url}`);
      }
    }

    await Post.create({ title: row.title, content: row.content, author: row.author, image, created_at });
    copied++;
    console.log(`  + ${row.title}`);
  }

  console.log(`Done. Copied ${copied} new posts.`);
  await mysqlConn.end();
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
