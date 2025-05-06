// 格式化时间戳为日期字符串
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 检查账号是否过期
export const isAccountExpired = (expireTime) => {
  if (!expireTime) return true;
  
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp > expireTime;
};

// 复制文本到剪贴板
export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

// 显示账号全名
export const getFullName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// 获取账号状态文本
export const getAccountStatusText = (isUsed, expireTime) => {
  if (isAccountExpired(expireTime)) {
    return '已过期';
  }
  return isUsed ? '已使用' : '未使用';
};

// 获取账号状态类名
export const getAccountStatusClass = (isUsed, expireTime) => {
  if (isAccountExpired(expireTime)) {
    return 'expired';
  }
  return isUsed ? 'used' : 'available';
};

// 保存token到localStorage和cookie
export const saveToken = (token) => {
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=${30*24*60*60}`;
};

// 清除token
export const clearToken = () => {
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// 获取当前用户是否为管理员
export const isAdmin = (user) => {
  return user && user.id === 1;
};
