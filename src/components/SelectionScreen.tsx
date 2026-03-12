import React from 'react';
import { motion } from 'motion/react';
import { Activity, Target, ArrowLeft, Palette } from 'lucide-react';

export default function SelectionScreen({ onSelect }: { onSelect: (type: 'sales' | 'budget' | 'creative') => void }) {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400 mb-4">
          مرحباً بك في منصة التحليل الذكية
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          اختر نوع التحليل الذي ترغب في إجرائه اليوم للبدء في تحسين أداء حملاتك الإعلانية وزيادة أرباحك.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        {/* Creative Analysis Option */}
        <motion.button
          whileHover={{ scale: 1.02, translateY: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => onSelect('creative')}
          className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all group text-right flex flex-col h-full"
        >
          <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30 w-fit mb-6 group-hover:bg-purple-500/30 transition-colors">
            <Palette className="text-purple-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">تحليل الكريتيف والتشخيص (Creative)</h2>
          <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
            تشخيص سريع في 10 ثوانٍ لمعرفة أين تكمن المشكلة بالضبط (هل هي في الإعلان، الموقع، أم الدفع؟) مع تحليل مؤشرات الجودة والتفاعل.
          </p>
          <div className="flex items-center gap-2 text-purple-400 font-bold mt-auto group-hover:translate-x-[-5px] transition-transform">
            <ArrowLeft size={20} />
            ابدأ التحليل
          </div>
        </motion.button>

        {/* Sales Analysis Option */}
        <motion.button
          whileHover={{ scale: 1.02, translateY: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => onSelect('sales')}
          className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all group text-right flex flex-col h-full"
        >
          <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 w-fit mb-6 group-hover:bg-indigo-500/30 transition-colors">
            <Activity className="text-indigo-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">تحليل مسار المبيعات (Sales Funnel)</h2>
          <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
            تحليل تفصيلي لمراحل مسار المبيعات من النقرة الأولى وحتى الشراء. اكتشف أين تفقد عملائك المحتملين واحصل على حلول ذكية.
          </p>
          <div className="flex items-center gap-2 text-indigo-400 font-bold mt-auto group-hover:translate-x-[-5px] transition-transform">
            <ArrowLeft size={20} />
            ابدأ التحليل
          </div>
        </motion.button>

        {/* Budget Analysis Option */}
        <motion.button
          whileHover={{ scale: 1.02, translateY: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => onSelect('budget')}
          className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all group text-right flex flex-col h-full"
        >
          <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 w-fit mb-6 group-hover:bg-emerald-500/30 transition-colors">
            <Target className="text-emerald-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">تحليل الميزانية (Budget & Scaling)</h2>
          <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
            تحليل مالي شامل للحملات الإعلانية. احسب الـ ROAS، CPA، و CPM. اكتشف متى يجب عليك زيادة الميزانية (Scaling) أو إيقاف الحملة.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-bold mt-auto group-hover:translate-x-[-5px] transition-transform">
            <ArrowLeft size={20} />
            ابدأ التحليل
          </div>
        </motion.button>
      </div>
    </div>
  );
}
