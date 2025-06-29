import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json()); 
app.use('/attachments', express.static(path.join(__dirname, 'attachments')));

const attachmentsDir = path.join(__dirname, 'attachments');
if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, attachmentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const readDB = () => {
  const dbPath = path.join(__dirname, 'db', 'db.json');
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

const writeDB = (data) => {
  const dbPath = path.join(__dirname, 'db', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

app.post('/features', upload.array('attachments'), (req, res) => {
  try {
    const db = readDB();
    const feature = {
      ...req.body,
      id: Date.now().toString(),
      attachments: []
    };

    if (req.files?.length) {
      feature.attachments = req.files.map(file => ({
        name: file.originalname,
        type: file.mimetype,
        url: `http://localhost:${PORT}/attachments/${file.filename}`
      }));
    }

    db.features.push(feature);
    writeDB(db);
    
    res.status(201).json(feature);
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`File server running on http://localhost:${PORT}`);
});