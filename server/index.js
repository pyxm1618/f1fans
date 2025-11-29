import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_BITABLE_APP_TOKEN,
  FEISHU_RECRUIT_TABLE_ID,
  FEISHU_VOTE_TABLE_ID,
  PORT,
  FEISHU_SERVER_PORT
} = process.env;

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET || !FEISHU_BITABLE_APP_TOKEN || !FEISHU_RECRUIT_TABLE_ID) {
  throw new Error('缺少必要的飞书环境变量，请确认 .env.local 配置完整');
}

const VOTE_TABLE_ID = FEISHU_VOTE_TABLE_ID || FEISHU_RECRUIT_TABLE_ID;
const SERVER_PORT = Number(FEISHU_SERVER_PORT || PORT || 8787);
const FEISHU_BASE_URL = 'https://open.feishu.cn/open-apis';

const VOTE_OPTIONS = [
  { id: 1, label: '小黄鸭泡泡浴', color: 'bg-yellow-500' },
  { id: 2, label: '零下10度冰桶挑战', color: 'bg-cyan-500' },
  { id: 3, label: '消防高压水枪', color: 'bg-red-500' },
  { id: 4, label: '搓澡巾 + 红酒浴', color: 'bg-purple-500' }
];

const voteOptionMap = new Map(VOTE_OPTIONS.map((opt) => [opt.id.toString(), opt]));

const app = express();
app.use(cors());
app.use(express.json());

let tokenCache = { token: null, expiresAt: 0 };

async function getTenantAccessToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token;
  }

  const response = await fetch(`${FEISHU_BASE_URL}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET })
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`获取 tenant_access_token 失败: ${data.msg}`);
  }

  tokenCache = {
    token: data.tenant_access_token,
    expiresAt: now + data.expire * 1000
  };

  return tokenCache.token;
}

async function feishuRequest(path, { method = 'GET', body } = {}) {
  const token = await getTenantAccessToken();
  const response = await fetch(`${FEISHU_BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const result = await response.json();
  if (result.code !== 0) {
    throw new Error(`飞书接口错误 ${result.code}: ${result.msg}`);
  }

  return result.data;
}

async function createRecord(tableId, fields) {
  return feishuRequest(`/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${tableId}/records`, {
    method: 'POST',
    body: { fields }
  });
}

async function listVoteRecords(pageToken) {
  const query = new URLSearchParams({ page_size: '200' });
  if (pageToken) query.set('page_token', pageToken);

  return feishuRequest(`/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${VOTE_TABLE_ID}/records?${query.toString()}`);
}

async function aggregateVoteTotals() {
  const totals = {};
  let pageToken;

  do {
    const data = await listVoteRecords(pageToken);
    (data.items || []).forEach((item) => {
      const optionId = item.fields?.OptionId || item.fields?.optionId || item.fields?.Option;
      if (!optionId) return;
      const key = optionId.toString();
      totals[key] = (totals[key] || 0) + 1;
    });
    pageToken = data.page_token;
  } while (pageToken);

  return totals;
}

app.post('/api/apply', async (req, res) => {
  const { name, role, contact } = req.body || {};

  if (!name || !role || !contact) {
    return res.status(400).json({ error: '请填写完整信息后再提交' });
  }

  try {
    await createRecord(FEISHU_RECRUIT_TABLE_ID, {
      Name: name,
      Role: role,
      Contact: contact,
      Timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('提交申请失败:', error.message);
    res.status(500).json({ error: '提交失败，请稍后再试' });
  }
});

app.get('/api/votes', async (_req, res) => {
  try {
    const totals = await aggregateVoteTotals();
    res.json({ totals, options: VOTE_OPTIONS });
  } catch (error) {
    console.error('获取投票数据失败:', error.message);
    res.status(500).json({ error: '无法获取投票统计，请稍后再试' });
  }
});

app.post('/api/vote', async (req, res) => {
  const { optionId } = req.body || {};
  const option = voteOptionMap.get(optionId?.toString());

  if (!option) {
    return res.status(400).json({ error: '非法的投票选项' });
  }

  try {
    await createRecord(VOTE_TABLE_ID, {
      OptionId: option.id,
      Option: option.label,
      Timestamp: new Date().toISOString()
    });

    const totals = await aggregateVoteTotals();
    res.json({ success: true, totals });
  } catch (error) {
    console.error('投票失败:', error.message);
    res.status(500).json({ error: '投票失败，请稍后再试' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(SERVER_PORT, () => {
  console.log(`Feishu proxy server running on port ${SERVER_PORT}`);
});
