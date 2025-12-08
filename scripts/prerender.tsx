import React from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, stat } from 'fs/promises';
import { resolve } from 'path';
import App from '../App';

async function prerender() {
  console.log('🚀 Starting prerender process...');
  console.log('📂 Working directory:', process.cwd());
  
  const distIndexPath = resolve(process.cwd(), 'dist', 'index.html');
  console.log('📄 Target file:', distIndexPath);
  
  try {
    const fileStat = await stat(distIndexPath);
    console.log(`📊 Original file size: ${fileStat.size} bytes`);
  } catch (error) {
    console.error('❌ File not found:', distIndexPath);
    throw error;
  }

  const template = await readFile(distIndexPath, 'utf-8');
  console.log(`📖 Template read successfully (${template.length} characters)`);

  console.log('⚛️  Rendering React app to HTML string...');
  const appHtml = renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log(`✨ Rendered HTML length: ${appHtml.length} characters`);

  if (!template.includes('<div id="root">')) {
    throw new Error('Unable to locate root mounting point for prerendering');
  }

  const rendered = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  console.log(`📝 Final HTML length: ${rendered.length} characters`);
  
  await writeFile(distIndexPath, rendered, 'utf-8');
  
  const finalStat = await stat(distIndexPath);
  console.log(`💾 Final file size: ${finalStat.size} bytes`);
  console.log('✅ Prerendered HTML successfully injected into dist/index.html');
}

prerender().catch((error) => {
  console.error('❌ Prerender failed:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});
