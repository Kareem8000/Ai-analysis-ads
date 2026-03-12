import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  Target, AlertTriangle, CheckCircle2, Calculator, ArrowRight, Upload, Download, ExternalLink, DollarSign, Activity, Eye, TrendingUp, BrainCircuit, BarChart3
} from 'lucide-react';
import { ThreeDBar, Hint, AnimatedValue, InputField } from './SharedComponents';

export default function BudgetDashboard({ onBack, onNavigate }: { onBack: () => void, onNavigate: (target: 'selection' | 'sales' | 'budget' | 'creative') => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputs, setInputs] = useState({
    adSpend: 1000,
    productPrice: 50,
    productCost: 20,
    impressions: 100000,
    purchases: 50,
  });

  const handleInputChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  // Financial Calculations
  const revenue = inputs.purchases * inputs.productPrice;
  const roas = inputs.adSpend > 0 ? revenue / inputs.adSpend : 0;
  const cpa = inputs.purchases > 0 ? inputs.adSpend / inputs.purchases : 0;
  const cpm = inputs.impressions > 0 ? (inputs.adSpend / inputs.impressions) * 1000 : 0;
  const totalCostOfGoods = inputs.purchases * inputs.productCost;
  const totalProfit = revenue - inputs.adSpend - totalCostOfGoods;
  const profitPerCustomer = inputs.purchases > 0 ? totalProfit / inputs.purchases : 0;

  // Scaling Decision Logic
  let scalingDecision = {
    status: 'Hold',
    message: 'الحملة متعادلة تقريباً. راقب الأداء وحاول تحسين الكريتيف أو صفحة الهبوط قبل زيادة الميزانية.',
    color: 'amber',
    icon: AlertTriangle
  };

  if (totalProfit > 0 && roas > 2) {
    scalingDecision = {
      status: 'Scale',
      message: 'الحملة مربحة جداً! يمكنك زيادة الميزانية (Scaling) بأمان لزيادة الأرباح.',
      color: 'emerald',
      icon: CheckCircle2
    };
  } else if (totalProfit < 0) {
    scalingDecision = {
      status: 'Pause/Fix',
      message: 'الحملة خاسرة. أوقف الحملة فوراً أو قم بتغيير الكريتيف والاستهداف.',
      color: 'rose',
      icon: AlertTriangle
    };
  }

  const financialBarData = [
    { name: 'الإنفاق', value: inputs.adSpend, fill: '#6366f1' },
    { name: 'الإيرادات', value: revenue, fill: '#10b981' },
    { name: 'التكلفة', value: totalCostOfGoods, fill: '#f59e0b' },
    { name: 'الربح', value: totalProfit > 0 ? totalProfit : 0, fill: totalProfit > 0 ? '#10b981' : '#f43f5e' },
  ];

  const costMetricsData = [
    { name: 'CPA', value: cpa, fill: '#8b5cf6' },
    { name: 'الربح للعميل', value: profitPerCustomer, fill: '#10b981' },
    { name: 'هامش الربح', value: inputs.productPrice - inputs.productCost, fill: '#3b82f6' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const data: any = results.data[0];
            setInputs({
              adSpend: Number(data['Amount Spent (USD)'] || data.adSpend || inputs.adSpend),
              productPrice: inputs.productPrice,
              productCost: inputs.productCost,
              impressions: Number(data.Impressions || data.impressions || inputs.impressions),
              purchases: Number(data.Purchases || data.purchases || inputs.purchases),
            });
          }
        }
      });
    }
  };

  const exportData = () => {
    const csvContent = `Metric,Value
Ad Spend,${inputs.adSpend}
Revenue,${revenue}
ROAS,${roas.toFixed(2)}
CPA,${cpa.toFixed(2)}
CPM,${cpm.toFixed(2)}
Total Profit,${totalProfit}
Scaling Decision,${scalingDecision.status}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "budget_analysis_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ArrowRight size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-teal-400 flex items-center gap-2">
                <Target className="text-emerald-400" />
                تحليل الميزانية (Budget & Scaling)
              </h1>
              <p className="text-xs text-slate-400 font-medium">تحليل مالي شامل للحملات الإعلانية</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-slate-700">
              <Upload size={16} />
              رفع بيانات (CSV)
            </button>
            <button onClick={() => onNavigate('sales')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20">
              <Activity size={16} />
              تحليل المبيعات
            </button>
            <button onClick={exportData} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20">
              <Download size={16} />
              تصدير التقرير
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Scaling Decision Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`bg-${scalingDecision.color}-900/20 border border-${scalingDecision.color}-500/30 p-8 rounded-3xl relative overflow-hidden`}
        >
          <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-${scalingDecision.color}-500 to-transparent`} />
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className={`p-6 bg-${scalingDecision.color}-500/20 rounded-full border border-${scalingDecision.color}-500/30 shrink-0`}>
              <scalingDecision.icon className={`text-${scalingDecision.color}-400`} size={64} />
            </div>
            <div className="flex-grow text-center md:text-right">
              <h2 className="text-3xl font-black text-white mb-2">
                القرار المالي: <span className={`text-${scalingDecision.color}-400`}>{scalingDecision.status}</span>
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                {scalingDecision.message}
              </p>
              {scalingDecision.status === 'Pause/Fix' && (
                <button 
                  onClick={() => onNavigate('creative')}
                  className={`inline-flex items-center gap-2 bg-${scalingDecision.color}-600 hover:bg-${scalingDecision.color}-500 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-${scalingDecision.color}-500/20`}
                >
                  تشخيص المشكلة (Creative Analysis)
                  <ExternalLink size={18} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="text-emerald-400" size={20} />
                البيانات المالية (Financial Data)
              </h3>
              <div className="space-y-4">
                <InputField label="الإنفاق الإعلاني (Ad Spend)" value={inputs.adSpend} onChange={(v) => handleInputChange('adSpend', v)} hint="إجمالي المبلغ المصروف على الإعلانات." />
                <InputField label="سعر بيع المنتج (Price)" value={inputs.productPrice} onChange={(v) => handleInputChange('productPrice', v)} hint="سعر بيع المنتج للعميل." />
                <InputField label="تكلفة المنتج (COGS)" value={inputs.productCost} onChange={(v) => handleInputChange('productCost', v)} hint="تكلفة شراء أو تصنيع المنتج." />
                <InputField label="الظهور (Impressions)" value={inputs.impressions} onChange={(v) => handleInputChange('impressions', v)} hint="عدد مرات ظهور الإعلان لحساب الـ CPM." />
                <InputField label="المشتريات (Purchases)" value={inputs.purchases} onChange={(v) => handleInputChange('purchases', v)} hint="عدد المبيعات الفعلية." />
              </div>
            </div>
          </motion.div>

          {/* KPIs & Charts Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard title="العائد الإعلاني (ROAS)" value={roas} prefix="x" isGood={roas >= 2} hint="العائد على الإنفاق الإعلاني. أعلى من 2 يعتبر جيداً." />
              <KpiCard title="تكلفة الشراء (CPA)" value={cpa} prefix="$" isGood={cpa < (inputs.productPrice - inputs.productCost)} hint="تكلفة الاستحواذ على عميل. يجب أن تكون أقل من هامش الربح." />
              <KpiCard title="تكلفة الألف ظهور (CPM)" value={cpm} prefix="$" isGood={true} hint="تكلفة ظهور الإعلان لألف شخص." />
              <KpiCard title="الربح الصافي" value={totalProfit} prefix="$" isGood={totalProfit > 0} hint="الإيرادات ناقص (الإنفاق الإعلاني + تكلفة المنتجات)." />
            </div>

            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm mt-6">
              <h3 className="text-xl font-bold text-white mb-6">نظرة عامة على الأداء المالي (Financial Overview)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      cursor={{ fill: '#1e293b', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'القيمة']}
                    />
                    <Bar dataKey="value" shape={<ThreeDBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Metrics Chart */}
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 size={20} className="text-indigo-400" />
                  تكلفة العميل مقابل الربح
                </h3>
                <Hint text="يقارن بين تكلفة الاستحواذ على العميل (CPA) وصافي الربح من هذا العميل." />
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costMetricsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      cursor={{ fill: '#1e293b', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'القيمة']}
                    />
                    <Bar dataKey="value" shape={<ThreeDBar />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({ title, value, prefix, isGood, hint }: { title: string, value: number, prefix: string, isGood: boolean, hint: string }) {
  return (
    <div className={`bg-slate-900/80 p-5 rounded-2xl border ${isGood ? 'border-slate-700/50' : 'border-rose-500/50 shadow-lg shadow-rose-500/10'} relative group`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-slate-400">{title}</h4>
        <Hint text={hint}>
          <div className="text-slate-500 hover:text-slate-300 cursor-help">
            <AlertTriangle size={14} className={!isGood ? "text-rose-500" : "hidden"} />
            {isGood && <CheckCircle2 size={14} className="text-emerald-500" />}
          </div>
        </Hint>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-black ${isGood ? 'text-white' : 'text-rose-400'}`}>
          {prefix}<AnimatedValue value={value} />
        </span>
      </div>
    </div>
  );
}
