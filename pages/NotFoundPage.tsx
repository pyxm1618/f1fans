import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';
import { useSEO } from '../utils/seo';

const NotFoundPage: React.FC = () => {
  useSEO('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-24 md:pt-24">
      <div className="max-w-2xl w-full text-center">
        {/* 404 图标 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-red-600/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-red-500">
              <span className="text-2xl font-bold text-red-500">404</span>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          页面未找到
        </h1>

        {/* 描述 */}
        <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。就像赛车偏离赛道一样，让我们回到正确的路线上！
        </p>

        {/* 错误代码 */}
        <div className="mb-12 p-4 bg-slate-800/50 rounded-lg border border-slate-700 inline-block">
          <code className="text-sm text-slate-300">
            <span className="text-red-400">Error:</span> HTTP 404 - Page Not Found
          </code>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300 font-medium"
          >
            <Home size={20} />
            返回首页
          </Link>

          <Link
            to="/standings"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-300 font-medium border border-slate-600"
          >
            <Search size={20} />
            查看积分榜
          </Link>
        </div>

        {/* 热门链接 */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-4">您可能感兴趣的页面：</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/phoenix"
              className="text-sm px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors duration-300 text-slate-300 hover:text-white"
            >
              凤凰计划
            </Link>
            <Link
              to="/shower-bet"
              className="text-sm px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors duration-300 text-slate-300 hover:text-white"
            >
              洗澡赌约
            </Link>
            <Link
              to="/schedule"
              className="text-sm px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors duration-300 text-slate-300 hover:text-white"
            >
              赛程表
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
