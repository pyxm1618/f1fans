const { aggregateVoteTotals, VOTE_OPTIONS } = require('./_feishu.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持 GET 方法' });
  }

  try {
    const { FEISHU_VOTE_TABLE_ID, FEISHU_RECRUIT_TABLE_ID } = process.env;
    const VOTE_TABLE_ID = FEISHU_VOTE_TABLE_ID || FEISHU_RECRUIT_TABLE_ID;
    
    if (!VOTE_TABLE_ID) {
      throw new Error('缺少投票表格 ID 配置');
    }

    const totals = await aggregateVoteTotals(VOTE_TABLE_ID);
    res.status(200).json({ totals, options: VOTE_OPTIONS });
  } catch (error) {
    console.error('获取投票数据失败:', error.message);
    res.status(500).json({ error: '无法获取投票统计，请稍后再试' });
  }
};
