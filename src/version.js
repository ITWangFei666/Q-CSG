// 版本号自动从构建环境变量 VITE_APP_VERSION 读取
// 构建时设置：VITE_APP_VERSION=v0.6.9 npm run build
// 默认值作为 fallback
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'dev'
