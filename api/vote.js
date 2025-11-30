import { createRecord, aggregateVoteTotals, voteOptionMap } from './_feishu.js';

export default async function handler(req, res) {
  // 设置 CORS 头
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

  try {
    // 详细的环境变量检查
    const { FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_BITABLE_APP_TOKEN, FEISHU_VOTE_TABLE_ID, FEISHU_RECRUIT_TABLE_ID } = process.env;
    
    console.log('投票API - 环境变量检查:', {
      hasAppId: !!FEISHU_APP_ID,
      hasAppSecret: !!FEISHU_APP_SECRET,
      hasBitableToken: !!FEISHU_BITABLE_APP_TOKEN,
      hasVoteTableId: !!FEISHU_VOTE_TABLE_ID,
      hasRecruitTableId: !!FEISHU_RECRUIT_TABLE_ID
    });
    
    if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
      console.error('缺少飞书应用凭证');
      return res.status(500).json({ error: '服务器配置错误：缺少飞书应用凭证' });
    }
    
    if (!FEISHU_BITABLE_APP_TOKEN) {
      console.error('缺少飞书多维表格 Token');
      return res.status(500).json({ error: '服务器配置错误：缺少多维表格 Token' });
    }

    const VOTE_TABLE_ID = FEISHU_VOTE_TABLE_ID || FEISHU_RECRUIT_TABLE_ID;
    
    if (!VOTE_TABLE_ID) {
      console.error('缺少投票表格 ID');
      return res.status(500).json({ error: '服务器配置错误：缺少投票表格 ID' });
    }

    console.log('使用投票表格 ID:', VOTE_TABLE_ID);

    const { optionId } = req.body || {};
    console.log('收到投票请求 - optionId:', optionId);

    const option = voteOptionMap.get(optionId?.toString());

    if (!option) {
      console.log('非法的投票选项:', optionId);
      return res.status(400).json({ error: '非法的投票选项' });
    }

    console.log('投票选项验证通过:', option);
    console.log('开始创建投票记录...');

    await createRecord(VOTE_TABLE_ID, {
      OptionId: option.id,
      Option: option.label,
      Timestamp: new Date().toISOString()
    });

    console.log('投票记录创建成功，开始获取统计...');
    const totals = await aggregateVoteTotals(VOTE_TABLE_ID);
    
    console.log('投票统计获取成功:', totals);
    res.status(200).json({ success: true, totals });
  } catch (error) {
    console.error('投票失败 - 详细错误:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: '投票失败，请稍后再试',
      details: error.message 
    });
  }
}
