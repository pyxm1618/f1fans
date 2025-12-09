import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { readFile, writeFile, stat } from 'fs/promises';
import { resolve } from 'path';
import App from '../App';
import { SEO_CONFIGS } from '../utils/seo';

const routes = [
  { path: '/', filename: 'index.html', seoKey: 'home' },
  { path: '/standings', filename: 'standings.html', seoKey: 'standings' },
  { path: '/schedule', filename: 'schedule.html', seoKey: 'schedule' },
  { path: '/phoenix', filename: 'phoenix.html', seoKey: 'phoenix' },
  { path: '/shower-bet', filename: 'shower-bet.html', seoKey: 'showerBet' },
];

function updateMetaTags(html: string, seoKey: string): string {
  const config = SEO_CONFIGS[seoKey];
  if (!config) return html;

  let result = html;
  
  result = result.replace(
    /<title>.*?<\/title>/,
    `<title>${config.title}</title>`
  );
  
  result = result.replace(
    /<meta name="description" content=".*?".*?\/>/,
    `<meta name="description" content="${config.description}" />`
  );
  
  result = result.replace(
    /<meta name="keywords" content=".*?".*?\/>/,
    `<meta name="keywords" content="${config.keywords}" />`
  );
  
  result = result.replace(
    /<meta property="og:title" content=".*?".*?\/>/,
    `<meta property="og:title" content="${config.ogTitle || config.title}" />`
  );
  
  result = result.replace(
    /<meta property="og:description" content=".*?".*?\/>/,
    `<meta property="og:description" content="${config.ogDescription || config.description}" />`
  );
  
  result = result.replace(
    /<meta property="og:url" content=".*?".*?\/>/,
    `<meta property="og:url" content="https://f1fans.cn${config.canonicalPath}" />`
  );
  
  // 添加或更新 og:image
  if (config.ogImage) {
    if (result.includes('<meta property="og:image"')) {
      result = result.replace(
        /<meta property="og:image" content=".*?".*?\/>/,
        `<meta property="og:image" content="${config.ogImage}" />`
      );
    } else {
      // 在 og:url 后插入 og:image
      result = result.replace(
        /(<meta property="og:url"[^>]*\/>)/,
        `$1\n    <meta property="og:image" content="${config.ogImage}" />`
      );
    }
    
    // 添加或更新 twitter:image
    if (result.includes('<meta name="twitter:image"')) {
      result = result.replace(
        /<meta name="twitter:image" content=".*?".*?\/>/,
        `<meta name="twitter:image" content="${config.ogImage}" />`
      );
    } else {
      // 在 twitter:description 后插入 twitter:image
      result = result.replace(
        /(<meta name="twitter:description"[^>]*\/>)/,
        `$1\n    <meta name="twitter:image" content="${config.ogImage}" />`
      );
    }
  }
  
  result = result.replace(
    /<link rel="canonical" href=".*?".*?\/>/,
    `<link rel="canonical" href="https://f1fans.cn${config.canonicalPath}" />`
  );

  return result;
}

async function prerenderRoute(route: typeof routes[0], template: string) {
  console.log(`\n🔄 Rendering route: ${route.path}`);
  
  const appHtml = renderToString(
    <React.StrictMode>
      <MemoryRouter initialEntries={[route.path]} initialIndex={0}>
        <App />
      </MemoryRouter>
    </React.StrictMode>
  );
  
  console.log(`  ✨ Rendered HTML length: ${appHtml.length} characters`);

  if (!template.includes('<div id="root">')) {
    throw new Error('Unable to locate root mounting point for prerendering');
  }

  let rendered = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  
  rendered = updateMetaTags(rendered, route.seoKey);
  
  const outputPath = resolve(process.cwd(), 'dist', route.filename);
  await writeFile(outputPath, rendered, 'utf-8');
  
  const finalStat = await stat(outputPath);
  console.log(`  💾 Saved to ${route.filename} (${finalStat.size} bytes)`);
}

async function prerender() {
  console.log('🚀 Starting multi-route prerender process...');
  console.log('📂 Working directory:', process.cwd());
  
  const distIndexPath = resolve(process.cwd(), 'dist', 'index.html');
  console.log('📄 Template file:', distIndexPath);
  
  try {
    const fileStat = await stat(distIndexPath);
    console.log(`📊 Original template size: ${fileStat.size} bytes`);
  } catch (error) {
    console.error('❌ Template file not found:', distIndexPath);
    throw error;
  }

  const template = await readFile(distIndexPath, 'utf-8');
  console.log(`📖 Template read successfully (${template.length} characters)`);

  for (const route of routes) {
    await prerenderRoute(route, template);
  }
  
  console.log('\n✅ All routes prerendered successfully!');
  console.log(`📊 Total routes: ${routes.length}`);
}

prerender().catch((error) => {
  console.error('\n❌ Prerender failed:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});
