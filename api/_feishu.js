const FEISHU_BASE_URL = 'https://open.feishu.cn/open-apis';

let tokenCache = { token: null, expiresAt: 0 };
let voteTokenCache = { token: null, expiresAt: 0 };

export const VOTE_OPTIONS = [
  { id: 1, label: '小黄鸭泡泡浴', color: 'bg-yellow-500' },
  { id: 2, label: '零下10度冰桶挑战', color: 'bg-cyan-500' },
  { id: 3, label: '消防高压水枪', color: 'bg-red-500' },
  { id: 4, label: '搓澡巾 + 红酒浴', color: 'bg-purple-500' }
];

export const voteOptionMap = new Map(VOTE_OPTIONS.map((opt) => [opt.id.toString(), opt]));

export async function getTenantAccessToken() {
  const { FEISHU_APP_ID, FEISHU_APP_SECRET } = process.env;
  
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    throw new Error('缺少飞书应用凭证');
  }

  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token;
  }

  const response = await fetch(`${FEISHU_BASE_URL}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      app_id: FEISHU_APP_ID, 
      app_secret: FEISHU_APP_SECRET 
    })
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

// 投票应用独立的 token 获取函数
export async function getVoteTenantAccessToken() {
  const { FEISHU_VOTE_APP_ID, FEISHU_VOTE_APP_SECRET } = process.env;
  
  if (!FEISHU_VOTE_APP_ID || !FEISHU_VOTE_APP_SECRET) {
    throw new Error('缺少投票应用凭证');
  }

  const now = Date.now();
  if (voteTokenCache.token && voteTokenCache.expiresAt > now + 60_000) {
    return voteTokenCache.token;
  }

  const response = await fetch(`${FEISHU_BASE_URL}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      app_id: FEISHU_VOTE_APP_ID, 
      app_secret: FEISHU_VOTE_APP_SECRET 
    })
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`获取投票应用 tenant_access_token 失败: ${data.msg}`);
  }

  voteTokenCache = {
    token: data.tenant_access_token,
    expiresAt: now + data.expire * 1000
  };

  return voteTokenCache.token;
}

export async function feishuRequest(path, { method = 'GET', body } = {}) {
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

// 投票应用专用的飞书请求函数
export async function voteFeishuRequest(path, { method = 'GET', body } = {}) {
  const token = await getVoteTenantAccessToken();
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
    throw new Error(`投票应用飞书接口错误 ${result.code}: ${result.msg}`);
  }

  return result.data;
}

export async function createRecord(tableId, fields) {
  const { FEISHU_BITABLE_APP_TOKEN } = process.env;
  
  if (!FEISHU_BITABLE_APP_TOKEN) {
    throw new Error('缺少飞书多维表格 Token');
  }

  return feishuRequest(`/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${tableId}/records`, {
    method: 'POST',
    body: { fields }
  });
}

export async function listVoteRecords(tableId, pageToken) {
  const { FEISHU_BITABLE_APP_TOKEN } = process.env;
  
  if (!FEISHU_BITABLE_APP_TOKEN) {
    throw new Error('缺少飞书多维表格 Token');
  }

  const query = new URLSearchParams({ page_size: '200' });
  if (pageToken) query.set('page_token', pageToken);

  return feishuRequest(`/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${tableId}/records?${query.toString()}`);
}

export async function aggregateVoteTotals(tableId) {
  const totals = {};
  let pageToken;

  do {
    const data = await listVoteRecords(tableId, pageToken);
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

// 投票应用专用函数
export async function createVoteRecord(tableId, fields) {
  const { FEISHU_VOTE_BITABLE_APP_TOKEN } = process.env;
  
  if (!FEISHU_VOTE_BITABLE_APP_TOKEN) {
    throw new Error('缺少投票应用多维表格 Token');
  }

  return voteFeishuRequest(`/bitable/v1/apps/${FEISHU_VOTE_BITABLE_APP_TOKEN}/tables/${tableId}/records`, {
    method: 'POST',
    body: { fields }
  });
}

export async function listVoteRecordsForVoteApp(tableId, pageToken) {
  const { FEISHU_VOTE_BITABLE_APP_TOKEN } = process.env;
  
  if (!FEISHU_VOTE_BITABLE_APP_TOKEN) {
    throw new Error('缺少投票应用多维表格 Token');
  }

  const query = new URLSearchParams({ page_size: '200' });
  if (pageToken) query.set('page_token', pageToken);

  return voteFeishuRequest(`/bitable/v1/apps/${FEISHU_VOTE_BITABLE_APP_TOKEN}/tables/${tableId}/records?${query.toString()}`);
}

export async function aggregateVoteTotalsForVoteApp(tableId) {
  const totals = {};
  let pageToken;

  do {
    const data = await listVoteRecordsForVoteApp(tableId, pageToken);
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
