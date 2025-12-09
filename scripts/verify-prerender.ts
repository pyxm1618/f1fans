import { readFile, stat } from 'fs/promises';
import { resolve } from 'path';

async function verifyPrerender() {
  const distIndexPath = resolve(process.cwd(), 'dist', 'index.html');

  console.log('🔍 正在验证 prerender 结果...');
  console.log('📄 检查文件:', distIndexPath);

  const fileStat = await stat(distIndexPath);
  console.log(`📊 文件大小: ${fileStat.size} bytes`);

  const minSize = 10_000;
  if (fileStat.size < minSize) {
    throw new Error(`dist/index.html 体积过小（${fileStat.size} < ${minSize}），可能未注入 SSR 内容`);
  }

  const html = await readFile(distIndexPath, 'utf-8');

  if (!html.includes('<div id="root">')) {
    throw new Error('未找到 <div id="root">，无法确认 SSR 输出');
  }

  if (/<div id="root">\s*<\/div>/.test(html)) {
    throw new Error('<div id="root"> 为空，SSR 内容可能缺失');
  }

  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"\s*\/?>(?:\r?\n)?/);
  if (!canonicalMatch) {
    throw new Error('未找到 canonical 标签');
  }

  const canonicalUrl = canonicalMatch[1];
  const expectedCanonical = 'https://f1fans.cn/';
  if (canonicalUrl !== expectedCanonical) {
    throw new Error(`canonical URL 异常：${canonicalUrl}，期望 ${expectedCanonical}`);
  }

  console.log('✅ prerender 验证通过，根节点包含 SSR 内容且 canonical 正确。');
}

verifyPrerender().catch((error) => {
  console.error('❌ prerender 验证失败:', error.message);
  process.exit(1);
});
