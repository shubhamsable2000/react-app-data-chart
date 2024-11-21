// server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 5001;

app.use(cors());

app.use(express.static('public'));

app.get('/api/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.json'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
