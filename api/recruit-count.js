import { feishuRequest } from './_feishu.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持 GET 方法' });
  }

  try {
    const { FEISHU_BITABLE_APP_TOKEN, FEISHU_RECRUIT_TABLE_ID } = process.env;
    
    if (!FEISHU_BITABLE_APP_TOKEN || !FEISHU_RECRUIT_TABLE_ID) {
      return res.status(500).json({ error: '服务器配置错误' });
    }

    // 获取招募表格的记录总数
    const data = await feishuRequest(
      `/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${FEISHU_RECRUIT_TABLE_ID}/records?page_size=1`
    );

    const count = data.total || 0;
    res.status(200).json({ count });
  } catch (error) {
    console.error('获取招募数量失败:', error.message);
    res.status(500).json({ error: '获取失败', count: 0 });
  }
}
