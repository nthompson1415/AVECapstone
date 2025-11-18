import { promises as fs } from 'fs';
import { resolve } from 'path';

const distDir = resolve('dist');
const source = resolve(distDir, 'index.html');
const target = resolve(distDir, '404.html');

try {
  await fs.access(source);
  const html = await fs.readFile(source, 'utf8');
  await fs.writeFile(target, html, 'utf8');
  console.log('Copied index.html -> 404.html');
} catch (error) {
  console.error('Unable to create 404.html fallback:', error.message);
  process.exitCode = 1;
}
