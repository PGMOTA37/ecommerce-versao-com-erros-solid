import 'reflect-metadata';
import 'dotenv/config';
import { createApp } from './app';

const app = createApp();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
