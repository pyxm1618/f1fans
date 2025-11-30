const { createRecord } = require('./_feishu.js');

module.exports = async function handler(req, res) {
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
    const { FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_BITABLE_APP_TOKEN, FEISHU_RECRUIT_TABLE_ID } = process.env;
    
    console.log('环境变量检查:', {
      hasAppId: !!FEISHU_APP_ID,
      hasAppSecret: !!FEISHU_APP_SECRET,
      hasBitableToken: !!FEISHU_BITABLE_APP_TOKEN,
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
    
    if (!FEISHU_RECRUIT_TABLE_ID) {
      console.error('缺少招募表格 ID');
      return res.status(500).json({ error: '服务器配置错误：缺少招募表格 ID' });
    }

    const { name, role, contact } = req.body || {};
    
    console.log('收到申请:', { name, role, contact });

    if (!name || !role || !contact) {
      return res.status(400).json({ error: '请填写完整信息后再提交' });
    }

    console.log('开始创建记录...');
    await createRecord(FEISHU_RECRUIT_TABLE_ID, {
      Name: name,
      Role: role,
      Contact: contact,
      Timestamp: new Date().toISOString()
    });

    console.log('记录创建成功');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('提交申请失败 - 详细错误:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: '提交失败，请稍后再试',
      details: error.message 
    });
  }
};
