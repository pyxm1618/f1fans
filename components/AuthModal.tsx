
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MessageSquare, Phone, Globe } from 'lucide-react';
import { supabase, signInWithWeChat, signInWithGoogle } from '../lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthMethod = 'wechat' | 'sms' | 'email' | 'google';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [method, setMethod] = useState<AuthMethod>('wechat');
    const [email, setEmail] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setInfoMessage('已发送登录链接到您的邮箱，请查收！');
        } catch (error: any) {
            setInfoMessage('发送失败: ' + error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error: any) {
            setInfoMessage('Google 登录失败: ' + error.message);
        }
    };


    const renderContent = () => {
        switch (method) {
            case 'wechat':
                return (
                    <div className="space-y-4 text-center">
                        <div className="w-40 h-40 bg-white mx-auto rounded-lg flex items-center justify-center border border-gray-200">
                            {/* Placeholder for QR Code */}
                            <span className="text-gray-400 text-sm">微信二维码加载中...</span>
                        </div>
                        <p className="text-sm text-slate-400">请使用微信扫一扫登录</p>
                        <button
                            onClick={signInWithWeChat}
                            className="w-full bg-[#07c160] hover:bg-[#06ad56] text-white py-2 rounded-md font-bold transition-colors"
                        >
                            跳转微信应用授权
                        </button>
                    </div>
                );
            case 'sms':
                return (
                    <div className="space-y-4">
                        <input
                            type="tel"
                            placeholder="请输入手机号"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="验证码"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors whitespace-nowrap">
                                获取验证码
                            </button>
                        </div>
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold transition-colors">
                            登录 / 注册
                        </button>
                    </div>
                );
            case 'email':
                return (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="请输入邮箱地址"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold transition-colors">
                            发送登录链接 (Magic Link)
                        </button>
                    </form>
                );
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b border-slate-800">
                                <h3 className="text-white font-bold text-lg">登录极速F1</h3>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-slate-950/50 p-1 m-4 rounded-lg">
                                {[
                                    { id: 'wechat', icon: MessageSquare, label: '微信' },
                                    { id: 'sms', icon: Phone, label: '手机' },
                                    { id: 'email', icon: Mail, label: '邮箱' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setMethod(item.id as AuthMethod); setInfoMessage(''); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${method === item.id
                                                ? 'bg-slate-800 text-white shadow'
                                                : 'text-slate-400 hover:text-slate-200'
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content Body */}
                            <div className="p-6 pt-0 min-h-[200px] flex flex-col justify-center">
                                {infoMessage && (
                                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm rounded">
                                        {infoMessage}
                                    </div>
                                )}
                                {renderContent()}

                                {/* Google Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                {/* Social Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 rounded transition-colors"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
