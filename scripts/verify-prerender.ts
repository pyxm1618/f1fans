import { readFile, stat } from 'fs/promises';
import { resolve } from 'path';

interface RouteConfig {
  filename: string;
  expectedCanonical: string;
  minSize: number;
  displayName: string;
}

const routes: RouteConfig[] = [
  { filename: 'index.html', expectedCanonical: 'https://f1fans.cn/', minSize: 10_000, displayName: '首页' },
  { filename: 'standings.html', expectedCanonical: 'https://f1fans.cn/standings', minSize: 8_000, displayName: '积分榜' },
  { filename: 'schedule.html', expectedCanonical: 'https://f1fans.cn/schedule', minSize: 8_000, displayName: '赛程' },
  { filename: 'phoenix.html', expectedCanonical: 'https://f1fans.cn/phoenix', minSize: 40_000, displayName: '凤凰计划' },
  { filename: 'shower-bet.html', expectedCanonical: 'https://f1fans.cn/shower-bet', minSize: 20_000, displayName: '洗澡赌约' },
  { filename: '404.html', expectedCanonical: 'https://f1fans.cn/404', minSize: 5_000, displayName: '404页面' },
];

async function verifyFile(route: RouteConfig): Promise<void> {
  const filePath = resolve(process.cwd(), 'dist', route.filename);

  console.log(`\n📄 检查文件: ${route.filename} (${route.displayName})`);

  const fileStat = await stat(filePath);
  console.log(`   📊 文件大小: ${fileStat.size} bytes`);

  if (fileStat.size < route.minSize) {
    throw new Error(`${route.filename} 体积过小（${fileStat.size} < ${route.minSize}），可能未注入 SSR 内容`);
  }

  const html = await readFile(filePath, 'utf-8');

  if (!html.includes('<div id="root">')) {
    throw new Error(`${route.filename} 未找到 <div id="root">，无法确认 SSR 输出`);
  }

  if (/<div id="root">\s*<\/div>/.test(html)) {
    throw new Error(`${route.filename} <div id="root"> 为空，SSR 内容可能缺失`);
  }

  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"\s*\/?>(?:\r?\n)?/);
  if (!canonicalMatch) {
    throw new Error(`${route.filename} 未找到 canonical 标签`);
  }

  const canonicalUrl = canonicalMatch[1];
  if (canonicalUrl !== route.expectedCanonical) {
    throw new Error(`${route.filename} canonical URL 异常：${canonicalUrl}，期望 ${route.expectedCanonical}`);
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    console.log(`   📝 标题: ${titleMatch[1]}`);
  }

  console.log(`   ✅ 验证通过`);
}

async function verifyPrerender() {
  console.log('🔍 开始验证所有预渲染页面...');
  console.log(`📂 工作目录: ${process.cwd()}/dist`);
  console.log(`🔢 待验证文件数: ${routes.length}`);

  let successCount = 0;
  const errors: string[] = [];

  for (const route of routes) {
    try {
      await verifyFile(route);
      successCount++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(`❌ ${route.filename}: ${errorMessage}`);
      console.error(`   ❌ 验证失败: ${errorMessage}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 验证结果: ${successCount}/${routes.length} 通过`);
  
  if (errors.length > 0) {
    console.log('\n❌ 失败的文件:');
    errors.forEach(error => console.log(`   ${error}`));
    throw new Error(`有 ${errors.length} 个文件验证失败`);
  }

  console.log('\n✅ 所有预渲染页面验证通过！');
}

verifyPrerender().catch((error) => {
  console.error('\n❌ 预渲染验证失败:', error.message);
  process.exit(1);
});
