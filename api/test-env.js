export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envCheck = {
    // 招募应用
    FEISHU_APP_ID: !!process.env.FEISHU_APP_ID,
    FEISHU_APP_SECRET: !!process.env.FEISHU_APP_SECRET,
    FEISHU_BITABLE_APP_TOKEN: !!process.env.FEISHU_BITABLE_APP_TOKEN,
    FEISHU_RECRUIT_TABLE_ID: !!process.env.FEISHU_RECRUIT_TABLE_ID,
    
    // 投票应用
    FEISHU_VOTE_APP_ID: !!process.env.FEISHU_VOTE_APP_ID,
    FEISHU_VOTE_APP_SECRET: !!process.env.FEISHU_VOTE_APP_SECRET,
    FEISHU_VOTE_BITABLE_APP_TOKEN: !!process.env.FEISHU_VOTE_BITABLE_APP_TOKEN,
    FEISHU_VOTE_TABLE_ID: !!process.env.FEISHU_VOTE_TABLE_ID,
    
    // 显示部分值（用于调试）
    VOTE_APP_ID_PREFIX: process.env.FEISHU_VOTE_APP_ID?.substring(0, 10) || 'NOT_SET',
    VOTE_TABLE_ID_PREFIX: process.env.FEISHU_VOTE_TABLE_ID?.substring(0, 10) || 'NOT_SET',
  };
  
  res.status(200).json(envCheck);
}
