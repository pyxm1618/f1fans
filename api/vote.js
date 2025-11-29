const { createRecord, aggregateVoteTotals, voteOptionMap } = require('./_feishu.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 方法' });
  }

  const { optionId } = req.body || {};
  const option = voteOptionMap.get(optionId?.toString());

  if (!option) {
    return res.status(400).json({ error: '非法的投票选项' });
  }

  try {
    const { FEISHU_VOTE_TABLE_ID, FEISHU_RECRUIT_TABLE_ID } = process.env;
    const VOTE_TABLE_ID = FEISHU_VOTE_TABLE_ID || FEISHU_RECRUIT_TABLE_ID;
    
    if (!VOTE_TABLE_ID) {
      throw new Error('缺少投票表格 ID 配置');
    }

    await createRecord(VOTE_TABLE_ID, {
      OptionId: option.id,
      Option: option.label,
      Timestamp: new Date().toISOString()
    });

    const totals = await aggregateVoteTotals(VOTE_TABLE_ID);
    res.status(200).json({ success: true, totals });
  } catch (error) {
    console.error('投票失败:', error.message);
    res.status(500).json({ error: '投票失败，请稍后再试' });
  }
};
