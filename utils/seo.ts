import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalPath: string;
}

const BASE_URL = 'https://f1fans.cn';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export const SEO_CONFIGS: Record<string, SEOConfig> = {
  home: {
    title: '极速F1 - F1车迷社区 | 2025赛季积分榜、赛程、凤凰计划',
    description: '极速F1是专业的F1赛车车迷社区，提供2025赛季最新积分榜、赛程表、车手排名、叶飞洗澡挑战。关注凤凰计划FH-1赛车，打造中国第12支F1车队。',
    keywords: 'F1,一级方程式,F1车迷,F1积分榜,F1赛程,凤凰计划,FH-1,叶飞,极速F1,F1中国,赛车,车手排名,F1 2026新规,中国F1车队,奥迪F1,F1社区',
    ogImage: DEFAULT_OG_IMAGE,
    canonicalPath: '/',
  },
  standings: {
    title: 'F1积分榜 - 2025赛季车手与车队排名 | 极速F1',
    description: '实时更新2025赛季F1车手积分榜和车队积分榜。查看维斯塔潘、汉密尔顿、勒克莱尔等顶级车手的最新排名，关注红牛、法拉利、梅赛德斯车队竞争态势。',
    keywords: 'F1积分榜,车手积分榜,车队积分榜,F1排名,维斯塔潘,汉密尔顿,勒克莱尔,2025赛季F1,红牛车队,法拉利车队,F1 2026车手,兰多·诺里斯,皮亚斯特里,迈凯伦,新秀车手',
    ogImage: DEFAULT_OG_IMAGE,
    canonicalPath: '/standings',
  },
  schedule: {
    title: 'F1赛程表 - 2025赛季完整赛历 | 极速F1',
    description: '2025赛季F1完整赛程表，包含所有分站赛时间、地点、赛道信息。提供练习赛、排位赛、正赛时间表，不错过任何精彩比赛。中国站、摩纳哥站、意大利站等经典赛道。',
    keywords: 'F1赛程,F1赛历,2025赛季F1,F1中国站,摩纳哥大奖赛,意大利大奖赛,F1比赛时间,F1赛道',
    ogImage: DEFAULT_OG_IMAGE,
    canonicalPath: '/schedule',
  },
  phoenix: {
    title: '凤凰计划 - 打造中国第12支F1车队 | 极速F1',
    description: '凤凰计划(Phoenix Project)旨在打造中国第一支F1车队。了解FH-1赛车研发进展、技术参数、叶飞领衔的中国工程师团队如何挑战世界顶级赛车竞技。',
    keywords: '凤凰计划,FH-1,中国F1车队,叶飞,F1赛车研发,中国赛车,Phoenix Project,F1技术,赛车工程,F1国产赛车,中国赛车投资,F1车队招募',
    ogImage: DEFAULT_OG_IMAGE,
    canonicalPath: '/phoenix',
  },
  showerBet: {
    title: '叶飞洗澡挑战 - 凤凰计划创始人的F1赌约 | 极速F1',
    description: '叶飞与车迷的洗澡挑战赌约：如果凤凰计划FH-1赛车成功进入F1，叶飞将在维多利亚港公开洗澡。关注这个疯狂又励志的F1梦想故事。',
    keywords: '叶飞洗澡,凤凰计划赌约,叶飞挑战,FH-1赛车,中国F1梦想,维多利亚港,赛车创业',
    ogImage: DEFAULT_OG_IMAGE,
    canonicalPath: '/shower-bet',
  },
  notFound: {
    title: '页面未找到 - 404 | 极速F1',
    description: '抱歉，您访问的页面不存在。返回极速F1首页，查看最新F1赛季积分榜、赛程、凤凰计划等精彩内容。',
    keywords: 'F1,极速F1,404,页面未找到',
    ogImage: DEFAULT_OG_IMAGE,
    canonicalPath: '/404',
  },
};

export const useSEO = (configKey: string) => {
  useEffect(() => {
    const config = SEO_CONFIGS[configKey];
    if (!config) return;

    document.title = config.title;

    const metaTags: Record<string, string> = {
      description: config.description,
      keywords: config.keywords,
      'og:title': config.ogTitle || config.title,
      'og:description': config.ogDescription || config.description,
      'og:url': `${BASE_URL}${config.canonicalPath}`,
      'og:type': 'website',
      'og:site_name': '极速F1',
      'og:locale': 'zh_CN',
      'twitter:card': 'summary_large_image',
      'twitter:title': config.ogTitle || config.title,
      'twitter:description': config.ogDescription || config.description,
      'twitter:site': '@f1fans_cn',
    };

    if (config.ogImage) {
      metaTags['og:image'] = config.ogImage;
      metaTags['twitter:image'] = config.ogImage;
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      const property = name.startsWith('og:') ? 'property' : 'name';
      let element = document.querySelector(`meta[${property}="${name}"]`) as HTMLMetaElement;

      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(property, name);
        element.content = content;
        document.head.appendChild(element);
      }
    });

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = `${BASE_URL}${config.canonicalPath}`;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = `${BASE_URL}${config.canonicalPath}`;
      document.head.appendChild(canonical);
    }
  }, [configKey]);
};
