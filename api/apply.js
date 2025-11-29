import { createRecord } from './_feishu.js';

export default async function handler(req, res) {
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

  const { name, role, contact } = req.body || {};

  if (!name || !role || !contact) {
    return res.status(400).json({ error: '请填写完整信息后再提交' });
  }

  try {
    const { FEISHU_RECRUIT_TABLE_ID } = process.env;
    
    if (!FEISHU_RECRUIT_TABLE_ID) {
      throw new Error('缺少招募表格 ID 配置');
    }

    await createRecord(FEISHU_RECRUIT_TABLE_ID, {
      Name: name,
      Role: role,
      Contact: contact,
      Timestamp: new Date().toISOString()
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('提交申请失败:', error.message);
    res.status(500).json({ error: '提交失败，请稍后再试' });
  }
}
