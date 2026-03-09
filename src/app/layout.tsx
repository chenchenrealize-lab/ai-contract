import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "闭坑宝AI - 租房合同风险分析",
  description: "上传租房合同照片，AI帮你识别风险条款，给出谈判建议",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-lg font-bold text-slate-800">闭坑宝AI</h1>
            </div>
            <span className="text-xs text-slate-400">租房合同风险分析</span>
          </div>
        </header>
        {/* 主内容区域 */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {children}
        </main>
        {/* 底部声明 */}
        <footer className="max-w-lg mx-auto px-4 py-8 text-center text-xs text-slate-400">
          <p>⚠️ 本工具仅供参考，不构成法律建议。重要合同请咨询专业律师。</p>
          <p className="mt-1">闭坑宝AI · 让租房更安心</p>
        </footer>
      </body>
    </html>
  );
}
