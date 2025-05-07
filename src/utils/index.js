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

// 响应式断点
export const BREAKPOINTS = {
  xs: 480,  // 超小屏幕，如手机竖屏
  sm: 576,  // 小屏幕，如手机横屏
  md: 768,  // 中等屏幕，如平板
  lg: 992,  // 大屏幕，如桌面显示器
  xl: 1200, // 超大屏幕
  xxl: 1600 // 特大屏幕
};

// 检测是否为移动设备
export const isMobile = () => {
  return window.innerWidth <= BREAKPOINTS.md ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 检测是否为小屏幕移动设备
export const isSmallMobile = () => {
  return window.innerWidth <= BREAKPOINTS.sm;
};

// 获取当前设备类型
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width <= BREAKPOINTS.xs) return 'xs';
  if (width <= BREAKPOINTS.sm) return 'sm';
  if (width <= BREAKPOINTS.md) return 'md';
  if (width <= BREAKPOINTS.lg) return 'lg';
  if (width <= BREAKPOINTS.xl) return 'xl';
  return 'xxl';
};

// 根据屏幕大小返回不同的值
export const responsiveValue = (options) => {
  const deviceType = getDeviceType();
  // 如果有精确匹配的设备类型，则返回对应值
  if (options[deviceType] !== undefined) {
    return options[deviceType];
  }

  // 否则返回最接近的较小设备的值
  const deviceOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const currentIndex = deviceOrder.indexOf(deviceType);

  // 向下查找最近的定义值
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (options[deviceOrder[i]] !== undefined) {
      return options[deviceOrder[i]];
    }
  }

  // 如果没有找到，返回默认值或undefined
  return options.default || undefined;
};
