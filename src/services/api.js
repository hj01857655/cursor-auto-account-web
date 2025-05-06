import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用相对路径，通过代理访问后端API
  timeout: 300000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 不发送凭证
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');

    // 如果有token则添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理401错误（未授权）
    if (error.response && error.response.status === 401) {
      // 清除token
      localStorage.removeItem('token');
      // 重定向到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data) => api.post('/login', data),

  // 用户注册
  register: (data) => api.post('/register', data),

  // 获取用户信息
  getUserInfo: () => api.get('/user'),

  // 更新用户信息
  updateUser: (userId, data) => api.put(`/user/${userId}`, data),
};

// 账号相关API
export const accountApi = {
  // 获取一个新账号
  getAccount: () => api.get('/account'),

  // 获取用户的所有账号
  getUserAccounts: (page = 1, perPage = 10) => api.get(`/accounts?page=${page}&per_page=${perPage}`),

  // 更新账号状态
  updateAccountStatus: (accountId, isUsed) => api.put(`/account/${accountId}/status`, { is_used: isUsed }),

  // 删除账号（逻辑删除）
  deleteAccount: (accountId) => api.put(`/account/${accountId}/delete`),
};

// 管理员相关API
export const adminApi = {
  // 获取所有账号
  getAllAccounts: (page = 1, perPage = 10, showDeleted = false) =>
    api.get(`/admin/accounts?page=${page}&per_page=${perPage}&show_deleted=${showDeleted}`),

  // 获取所有用户
  getAllUsers: (page = 1, perPage = 10) => api.get(`/admin/users?page=${page}&per_page=${perPage}`),
};

export default api;
