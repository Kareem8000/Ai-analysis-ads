import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  FunnelChart, Funnel, LabelList, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import { 
  MousePointerClick, ShoppingCart, CreditCard, ShoppingBag, 
  AlertTriangle, CheckCircle2, Calculator, ArrowDown, Activity, Target,
  Upload, Download, BrainCircuit, BarChart3, PieChart as PieChartIcon, ChevronDown, ChevronUp, Info, ArrowRight
} from 'lucide-react';
import { ThreeDBar, Hint, AnimatedValue, InputField, Card } from './SharedComponents';

export default function SalesDashboard({ onBack, onNavigate }: { onBack: () => void, onNavigate: (target: 'selection' | 'sales' | 'budget' | 'creative') => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // 1. Input Variables State
  const [inputs, setInputs] = useState({
    linkClick: 1000,
    outboundClick: 750,
    contentView: 700,
    addToCart: 100,
    initiateCheckout: 45,
    purchase: 20
  });

  // 2. Calculated Metrics
  const landingRate = inputs.linkClick > 0 ? (inputs.outboundClick / inputs.linkClick) * 100 : 0;
  const atcRate = inputs.contentView > 0 ? (inputs.addToCart / inputs.contentView) * 100 : 0;
  const checkoutRate = inputs.addToCart > 0 ? (inputs.initiateCheckout / inputs.addToCart) * 100 : 0;
  const purchaseRateCheckout = inputs.initiateCheckout > 0 ? (inputs.purchase / inputs.initiateCheckout) * 100 : 0;
  const purchaseRateCart = inputs.addToCart > 0 ? (inputs.purchase / inputs.addToCart) * 100 : 0;

  // 3. Modules Definition
  const modules = [
    {
      id: 'visit',
      title: 'Module 1: Visit Page Analysis',
      icon: MousePointerClick,
      color: 'blue',
      rate: landingRate,
      equationText: 'Outbound Click ÷ Link Click × 100',
      equationValues: `${inputs.outboundClick} ÷ ${inputs.linkClick} × 100`,
      hint: 'يقيس مدى نجاح الإعلان في إقناع المستخدم بالانتظار حتى تحميل الصفحة.',
      evaluate: (rate: number) => {
        if (rate >= 80) return { text: 'ممتاز 🔥', status: 'excellent', color: 'bg-emerald-900/30 text-emerald-400 border-emerald-800', level: 4 };
        if (rate >= 60) return { text: 'جيد 👍', status: 'good', color: 'bg-blue-900/30 text-blue-400 border-blue-800', level: 3 };
        if (rate >= 50) return { text: 'متوسط ⚠️', status: 'medium', color: 'bg-amber-900/30 text-amber-400 border-amber-800', level: 2 };
        return { text: 'مشكلة 🚨', status: 'problem', color: 'bg-rose-900/30 text-rose-400 border-rose-800', level: 1 };
      },
      problems: ['سرعة تحميل الموقع بطيئة جداً', 'رابط الإعلان (URL) معطوب أو خاطئ', 'الموقع غير متوافق مع الهواتف (Mobile Optimization)', 'الجمهور المستهدف غير مهتم (Clickbait)'],
      solutions: ['ضغط الصور واستخدام كاش (Caching) لتسريع الموقع', 'التأكد من صحة الرابط في مدير الإعلانات', 'تحسين تجربة المستخدم على الموبايل', 'توضيح العرض في الإعلان لتجنب النقرات الوهمية'],
      details: `فقدان الزوار في هذه المرحلة يعني أنك تدفع مقابل نقرات لا تصل إلى موقعك. تأكد من أن زمن تحميل الصفحة أقل من 3 ثوانٍ.`
    },
    {
      id: 'atc',
      title: 'Module 2: Add To Cart Analysis',
      icon: ShoppingCart,
      color: 'purple',
      rate: atcRate,
      equationText: 'Add To Cart ÷ Content View × 100',
      equationValues: `${inputs.addToCart} ÷ ${inputs.contentView} × 100`,
      hint: 'يقيس مدى جاذبية المنتج وسعره للزائر بعد رؤية صفحة المنتج.',
      evaluate: (rate: number) => {
        if (rate >= 30) return { text: 'ممتاز 🔥', status: 'excellent', color: 'bg-emerald-900/30 text-emerald-400 border-emerald-800', level: 4 };
        if (rate >= 20) return { text: 'جيد 👍', status: 'good', color: 'bg-blue-900/30 text-blue-400 border-blue-800', level: 3 };
        if (rate >= 10) return { text: 'متوسط ⚠️', status: 'medium', color: 'bg-amber-900/30 text-amber-400 border-amber-800', level: 2 };
        return { text: 'مشكلة 🚨', status: 'problem', color: 'bg-rose-900/30 text-rose-400 border-rose-800', level: 1 };
      },
      problems: ['صور المنتج ضعيفة الجودة', 'وصف المنتج غير مقنع أو ناقص', 'السعر مرتفع مقارنة بالقيمة', 'زر "أضف للسلة" غير واضح', 'تكلفة الشحن غير واضحة'],
      solutions: ['استخدام صور وفيديوهات عالية الجودة للمنتج', 'كتابة وصف يركز على الفوائد وحل مشكلة العميل', 'إضافة مراجعات وتقييمات العملاء (Social Proof)', 'جعل زر الإضافة للسلة بلون بارز وحجم كبير'],
      details: `معدل الإضافة للسلة يعكس مدى رغبة العميل في المنتج. إذا كان منخفضاً، فالمشكلة غالباً في العرض (Offer) أو صفحة الهبوط.`
    },
    {
      id: 'checkout',
      title: 'Module 3: Checkout Analysis',
      icon: CreditCard,
      color: 'orange',
      rate: checkoutRate,
      equationText: 'Initiate Checkout ÷ Add To Cart × 100',
      equationValues: `${inputs.initiateCheckout} ÷ ${inputs.addToCart} × 100`,
      hint: 'يقيس نسبة الأشخاص الذين انتقلوا من السلة إلى صفحة الدفع.',
      evaluate: (rate: number) => {
        if (rate >= 70) return { text: 'ممتاز 🔥', status: 'excellent', color: 'bg-emerald-900/30 text-emerald-400 border-emerald-800', level: 4 };
        if (rate >= 50) return { text: 'جيد 👍', status: 'good', color: 'bg-blue-900/30 text-blue-400 border-blue-800', level: 3 };
        if (rate >= 40) return { text: 'متوسط ⚠️', status: 'medium', color: 'bg-amber-900/30 text-amber-400 border-amber-800', level: 2 };
        return { text: 'مشكلة 🚨', status: 'problem', color: 'bg-rose-900/30 text-rose-400 border-rose-800', level: 1 };
      },
      problems: ['مفاجأة العميل بتكاليف شحن عالية', 'طلب إنشاء حساب إجباري قبل الدفع', 'صفحة السلة معقدة أو بطيئة', 'عدم وجود خيارات دفع متنوعة'],
      solutions: ['توضيح تكاليف الشحن في صفحة المنتج', 'تفعيل خيار "الدفع كزائر" (Guest Checkout)', 'تبسيط صفحة السلة وإزالة المشتتات', 'إضافة شارات الثقة (Trust Badges)'],
      details: `التخلي عن السلة (Cart Abandonment) هو أكبر تحدي في التجارة الإلكترونية. الشفافية في التكاليف هي مفتاح الحل.`
    },
    {
      id: 'purchase',
      title: 'Module 4: Purchase Analysis',
      icon: ShoppingBag,
      color: 'emerald',
      rate: purchaseRateCheckout,
      equationText: 'Purchase ÷ Initiate Checkout × 100',
      equationValues: `${inputs.purchase} ÷ ${inputs.initiateCheckout} × 100`,
      secondaryEquationText: 'Purchase ÷ Add To Cart × 100',
      secondaryEquationValues: `${inputs.purchase} ÷ ${inputs.addToCart} × 100`,
      secondaryRate: purchaseRateCart,
      hint: 'يقيس نسبة إتمام عملية الدفع بنجاح.',
      evaluate: (rate: number) => {
        if (rate >= 70) return { text: 'ممتاز 🔥', status: 'excellent', color: 'bg-emerald-900/30 text-emerald-400 border-emerald-800', level: 4 };
        if (rate >= 50) return { text: 'جيد 👍', status: 'good', color: 'bg-blue-900/30 text-blue-400 border-blue-800', level: 3 };
        if (rate >= 40) return { text: 'ضعيف ⚠️', status: 'medium', color: 'bg-amber-900/30 text-amber-400 border-amber-800', level: 2 };
        return { text: 'مشكلة 🚨', status: 'problem', color: 'bg-rose-900/30 text-rose-400 border-rose-800', level: 1 };
      },
      problems: ['بوابة الدفع (Payment Gateway) لا تعمل أو ترفض البطاقات', 'نموذج الدفع طويل ويطلب معلومات غير ضرورية', 'عدم توفر الدفع عند الاستلام (COD) في أسواق تعتمد عليه', 'مخاوف أمنية لدى العميل'],
      solutions: ['اختبار بوابة الدفع بانتظام وتوفير بدائل', 'تقليل عدد الحقول المطلوبة في نموذج الدفع', 'توفير خيارات دفع محلية (مثل مدى، أبل باي، الدفع عند الاستلام)', 'عرض سياسة الاسترجاع بوضوح'],
      details: `إذا وصل العميل إلى هنا ولم يشترِ، فالمشكلة تقنية أو متعلقة بالثقة. تأكد من سلاسة عملية الدفع.`
    }
  ];

  // Evaluate all modules
  const evaluatedModules = modules.map(m => ({ ...m, evalResult: m.evaluate(m.rate) }));
  
  // Find the weakest module (lowest level)
  let weakestModule = evaluatedModules[0];
  for (let i = 1; i < evaluatedModules.length; i++) {
    if (evaluatedModules[i].evalResult.level < weakestModule.evalResult.level) {
      weakestModule = evaluatedModules[i];
    }
  }
  const hasWeakness = weakestModule.evalResult.level <= 2;

  // --- Data Visualization Data ---
  const funnelData = [
    { name: 'Link Clicks', value: inputs.linkClick, fill: '#3b82f6' },
    { name: 'Outbound', value: inputs.outboundClick, fill: '#8b5cf6' },
    { name: 'Content View', value: inputs.contentView, fill: '#f97316' },
    { name: 'Add to Cart', value: inputs.addToCart, fill: '#10b981' },
    { name: 'Checkout', value: inputs.initiateCheckout, fill: '#eab308' },
    { name: 'Purchase', value: inputs.purchase, fill: '#22c55e' }
  ];

  const pieData = [
    { name: 'Lost after Click', value: Math.max(0, inputs.linkClick - inputs.outboundClick), color: '#ef4444' },
    { name: 'Lost before View', value: Math.max(0, inputs.outboundClick - inputs.contentView), color: '#f97316' },
    { name: 'Lost before Cart', value: Math.max(0, inputs.contentView - inputs.addToCart), color: '#eab308' },
    { name: 'Lost before Checkout', value: Math.max(0, inputs.addToCart - inputs.initiateCheckout), color: '#3b82f6' },
    { name: 'Lost before Purchase', value: Math.max(0, inputs.initiateCheckout - inputs.purchase), color: '#8b5cf6' },
    { name: 'Purchased', value: inputs.purchase, color: '#10b981' }
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Visit Rate', actual: landingRate, target: 80 },
    { name: 'ATC Rate', actual: atcRate, target: 30 },
    { name: 'Checkout Rate', actual: checkoutRate, target: 70 },
    { name: 'Purchase Rate', actual: purchaseRateCheckout, target: 70 },
  ];

  // --- Handlers ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        let newInputs = { linkClick: 0, outboundClick: 0, contentView: 0, addToCart: 0, initiateCheckout: 0, purchase: 0 };
        
        results.data.forEach((row: any) => {
          Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();
            const val = Number(row[key]) || 0;
            
            if (lowerKey.includes('link clicks')) newInputs.linkClick += val;
            else if (lowerKey.includes('outbound clicks')) newInputs.outboundClick += val;
            else if (lowerKey.includes('content views') || lowerKey.includes('view content')) newInputs.contentView += val;
            else if (lowerKey.includes('adds to cart') || lowerKey.includes('add to cart')) newInputs.addToCart += val;
            else if (lowerKey.includes('checkouts initiated') || lowerKey.includes('initiate checkout')) newInputs.initiateCheckout += val;
            else if (lowerKey.includes('purchases') && !lowerKey.includes('value')) newInputs.purchase += val;
          });
        });

        setInputs({
          linkClick: newInputs.linkClick || inputs.linkClick,
          outboundClick: newInputs.outboundClick || inputs.outboundClick,
          contentView: newInputs.contentView || inputs.contentView,
          addToCart: newInputs.addToCart || inputs.addToCart,
          initiateCheckout: newInputs.initiateCheckout || inputs.initiateCheckout,
          purchase: newInputs.purchase || inputs.purchase,
        });
      }
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Metric', 'Value', 'Rate', 'Evaluation'],
      ['Link Clicks', inputs.linkClick, '-', '-'],
      ['Outbound Clicks', inputs.outboundClick, `${landingRate.toFixed(2)}%`, evaluatedModules[0].evalResult.text.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim()],
      ['Content Views', inputs.contentView, '-', '-'],
      ['Adds To Cart', inputs.addToCart, `${atcRate.toFixed(2)}%`, evaluatedModules[1].evalResult.text.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim()],
      ['Checkouts Initiated', inputs.initiateCheckout, `${checkoutRate.toFixed(2)}%`, evaluatedModules[2].evalResult.text.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim()],
      ['Purchases', inputs.purchase, `${purchaseRateCheckout.toFixed(2)}%`, evaluatedModules[3].evalResult.text.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim()],
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "funnel_analysis_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Styles ---
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-800/50 bg-blue-900/10',
    purple: 'border-purple-800/50 bg-purple-900/10',
    orange: 'border-orange-800/50 bg-orange-900/10',
    emerald: 'border-emerald-800/50 bg-emerald-900/10',
  };

  const iconColors: Record<string, string> = {
    blue: 'bg-blue-900/50 text-blue-400',
    purple: 'bg-purple-900/50 text-purple-400',
    orange: 'bg-orange-900/50 text-orange-400',
    emerald: 'bg-emerald-900/50 text-emerald-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      dir="rtl" className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20 selection:bg-indigo-500/30"
    >
      {/* SVG Filters for 3D Effects */}
      <svg width="0" height="0">
        <defs>
          <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>
      </svg>

      {/* Header */}
      <header className="bg-slate-900 text-white pt-12 pb-32 px-6 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-20 right-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px]"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowRight size={20} />
            العودة للقائمة الرئيسية
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                  <Activity className="text-indigo-400" size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400">
                  نظام تحليل مسار المبيعات
                </h1>
              </div>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                أدخل متغيرات الأداء الخاصة بحملاتك الإعلانية أو قم برفع تقرير Meta Ads وسيقوم النظام تلقائياً بحساب المؤشرات، تقييم الأداء، وتحديد أماكن التسريب والمشاكل.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-center gap-3">
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  <Upload size={18} />
                  استيراد تقرير Meta CSV
                </button>
                <button 
                  onClick={() => onNavigate('budget')}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                  <Target size={18} />
                  تحليل الميزانية
                </button>
                <button 
                  onClick={() => onNavigate('creative')}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 hover:-translate-y-0.5"
                >
                  <BrainCircuit size={18} />
                  تحليل الكريتيف
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl font-medium transition-all border border-slate-700 hover:border-slate-600"
                >
                  <Download size={18} />
                  تصدير التقرير النهائي
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20 space-y-8">
        
        {/* Meta Pixel Warning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-indigo-900/30 border border-indigo-800/50 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm"
        >
          <Info className="text-indigo-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-indigo-300 mb-1">ملاحظة هامة حول بيانات Meta Pixel</h4>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              الأرقام الخاصة بـ (Add to Cart, Checkout, Purchases) المحسوبة هنا تعتمد على ما يجمعه بكسل ميتا (Meta Pixel) فقط. أي مبيعات أو أحداث تتم خارج الإنترنت (Offline) أو لم يتم تتبعها بواسطة البكسل لن تكون مشمولة في هذا التقرير.
            </p>
          </div>
        </motion.div>

        {/* Input Section (Sticky) */}
        <Card className="p-6 sticky top-4 z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calculator size={20} className="text-indigo-400" />
              إدخال المتغيرات (Input Variables)
            </h2>
            <Hint text="قم بإدخال الأرقام من تقارير حملاتك الإعلانية هنا. سيتم تحديث التحليل والرسوم البيانية تلقائياً بمجرد تغيير أي رقم." />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <InputField label="Link Click" value={inputs.linkClick} onChange={(v) => setInputs({...inputs, linkClick: v})} hint="عدد النقرات على رابط الإعلان" />
            <InputField label="Outbound Click" value={inputs.outboundClick} onChange={(v) => setInputs({...inputs, outboundClick: v})} hint="عدد النقرات التي غادرت منصة الإعلان إلى موقعك" />
            <InputField label="Content View" value={inputs.contentView} onChange={(v) => setInputs({...inputs, contentView: v})} hint="عدد مرات عرض محتوى صفحة المنتج" />
            <InputField label="Add To Cart" value={inputs.addToCart} onChange={(v) => setInputs({...inputs, addToCart: v})} hint="عدد مرات الإضافة إلى السلة" />
            <InputField label="Initiate Checkout" value={inputs.initiateCheckout} onChange={(v) => setInputs({...inputs, initiateCheckout: v})} hint="عدد مرات البدء في عملية الدفع" />
            <InputField label="Purchase" value={inputs.purchase} onChange={(v) => setInputs({...inputs, purchase: v})} hint="عدد عمليات الشراء الناجحة" />
          </div>
        </Card>

        {/* Smart Insights & Data Visualization */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Smart Insights */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className={`p-6 rounded-2xl shadow-xl border-2 lg:col-span-3 relative overflow-hidden ${hasWeakness ? 'bg-rose-950/30 border-rose-900/50' : 'bg-emerald-950/30 border-emerald-900/50'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${hasWeakness ? 'text-rose-400' : 'text-emerald-400'}`}>
                <BrainCircuit />
                التحليل الذكي (Smart Insights)
              </h2>
              <Hint text="يقوم النظام بتحليل مسار المبيعات بالكامل وتحديد أضعف نقطة (عنق الزجاجة) التي تتسبب في خسارة أكبر عدد من العملاء المحتملين." />
            </div>
            {hasWeakness ? (
              <div className="space-y-3 relative z-10">
                <p className="text-lg text-slate-300 flex items-center flex-wrap gap-2">
                  بناءً على البيانات المدخلة، تم اكتشاف تسريب رئيسي في: 
                  <span className="bg-rose-900/50 px-3 py-1.5 rounded-lg text-rose-300 border border-rose-800/50 font-bold shadow-inner">
                    {weakestModule.title}
                  </span>
                </p>
                <p className="text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                  معدل التحويل في هذه المرحلة هو <strong className="text-rose-400 text-xl"><AnimatedValue value={weakestModule.rate} suffix="%" /></strong>، وهو أقل من المعدل المطلوب. 
                  هذا يعني أنك تفقد جزءاً كبيراً من العملاء المحتملين هنا. يرجى مراجعة الأسباب المحتملة مثل: <span className="text-slate-300">{weakestModule.problems.join('، ')}</span>.
                </p>
              </div>
            ) : (
              <p className="text-lg text-emerald-400 font-medium relative z-10 bg-emerald-900/20 p-4 rounded-xl border border-emerald-800/30">
                الأداء ممتاز في جميع المراحل! لا يوجد تسريب واضح في مسار المبيعات. استمر في تحسين جودة الزيارات لزيادة الحجم الإجمالي.
              </p>
            )}
          </motion.div>

          {/* Funnel Chart */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-400" />
                مسار التحويل (3D Funnel)
              </h3>
              <Hint text="يوضح هذا الرسم البياني التناقص التدريجي في عدد المستخدمين عبر مراحل مسار المبيعات. كلما كان الانحدار أقل، كان الأداء أفضل." />
            </div>
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ fontWeight: 'bold' }} />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                    filter="url(#shadow3d)"
                  >
                    <LabelList position="right" fill="#cbd5e1" stroke="none" dataKey="name" fontSize={12} fontWeight="bold" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Drop-off Pie Chart */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <PieChartIcon size={18} className="text-indigo-400" />
                توزيع التسريب (Drop-off)
              </h3>
              <Hint text="يوضح أين تفقد العملاء بالضبط. القطاع الأكبر يمثل المرحلة التي تخسر فيها أكبر عدد من المستخدمين." />
            </div>
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive
                    filter="url(#shadow3d)"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '0.75rem' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Rates Bar Chart (3D) */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-400" />
                مقارنة الأداء (3D Bars)
              </h3>
              <Hint text="يقارن معدلات التحويل الفعلية لكل مرحلة مع المعدلات المستهدفة (Target). الأعمدة التي لا تصل للهدف تحتاج إلى تحسين." />
            </div>
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '0.75rem' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="actual" name="Actual %" fill="#6366f1" shape={<ThreeDBar />} isAnimationActive />
                  <Bar dataKey="target" name="Target %" fill="#334155" shape={<ThreeDBar />} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Funnel Modules */}
        <div className="space-y-6 mt-10">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-slate-100">تفاصيل مراحل مسار المبيعات</h2>
            <Hint text="تحليل مفصل لكل مرحلة على حدة، يوضح التقييم، المعادلات، والأسباب والحلول المقترحة في حال وجود ضعف." />
          </div>
          
          {evaluatedModules.map((module, index) => {
            const isWeakest = hasWeakness && module.id === weakestModule.id;
            const showProblems = module.evalResult.level <= 2;
            const isExpanded = expandedModule === module.id;

            return (
              <React.Fragment key={module.id}>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-6 md:p-8 rounded-2xl border-t-4 shadow-xl bg-slate-900 transition-all duration-300 ${colorClasses[module.color]} ${isWeakest ? 'ring-2 ring-rose-500/50 shadow-rose-900/30 scale-[1.02] z-10' : 'hover:shadow-indigo-900/10 hover:border-slate-700'}`}
                >
                  {isWeakest && (
                    <div className="absolute -top-4 left-6 bg-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 border border-rose-500 z-20">
                      <AlertTriangle size={14} /> أكبر تسريب
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl shadow-inner ${iconColors[module.color]}`}>
                        <module.icon size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                          {module.title}
                          <Hint text={module.hint} />
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">تقييم الأداء التلقائي بناءً على المعايير الصناعية</p>
                      </div>
                    </div>
                    <motion.div 
                      key={module.evalResult.text}
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className={`px-6 py-3 rounded-xl font-bold text-lg border flex items-center justify-center min-w-[140px] shadow-lg ${module.evalResult.color}`}
                    >
                      {module.evalResult.text}
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity"></div>
                      <p className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                        المعادلة الحسابية
                        <Hint text="كيف يتم حساب هذه النسبة." />
                      </p>
                      <p className="font-mono text-sm text-slate-300 mb-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 shadow-inner" dir="ltr">{module.equationText}</p>
                      <div className="flex items-center gap-2" dir="ltr">
                        <span className="font-mono font-bold text-indigo-400 bg-indigo-900/30 py-2 px-4 rounded-xl border border-indigo-800/50 shadow-sm">
                          {module.equationValues}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:opacity-10 transition-opacity"></div>
                      <p className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                        النتيجة (Metric)
                        <Hint text="معدل التحويل الفعلي لهذه المرحلة." />
                      </p>
                      <p className="text-6xl font-black text-slate-100 tracking-tight drop-shadow-lg">
                        <AnimatedValue value={module.rate} />
                        <span className="text-3xl text-slate-500 ml-1 font-bold">%</span>
                      </p>
                    </div>
                  </div>

                  {/* Expandable Advanced Details */}
                  <div className="mt-4 border-t border-slate-800/50 pt-4">
                    <button 
                      onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                      className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-900/10 hover:bg-indigo-900/20 px-4 py-2 rounded-lg"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'إخفاء التفاصيل المتقدمة' : 'عرض التفاصيل المتقدمة'}
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 pb-2">
                            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 flex items-start gap-3">
                              <Info className="text-indigo-400 shrink-0 mt-0.5" size={20} />
                              <p className="text-slate-300 leading-relaxed text-sm">{module.details}</p>
                            </div>
                            
                            {module.secondaryEquationText && (
                              <div className="grid md:grid-cols-2 gap-6 mt-4 opacity-90">
                                <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/30 flex flex-col justify-center">
                                  <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-wider">المعادلة الثانوية (Cart to Purchase)</p>
                                  <p className="font-mono text-xs text-slate-300 mb-2 bg-slate-900 p-2 rounded border border-slate-800" dir="ltr">{module.secondaryEquationText}</p>
                                  <div className="flex items-center gap-2" dir="ltr">
                                    <span className="font-mono font-bold text-indigo-400 bg-indigo-900/20 py-1 px-2 rounded border border-indigo-800/30 text-xs">
                                      {module.secondaryEquationValues}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/30 flex flex-col justify-center items-center text-center">
                                  <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">النتيجة الثانوية</p>
                                  <p className="text-3xl font-bold text-slate-300 tracking-tight">
                                    <AnimatedValue value={module.secondaryRate || 0} /><span className="text-xl text-slate-500 ml-1">%</span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {showProblems && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid md:grid-cols-2 gap-6 pt-6 mt-4 border-t border-slate-800">
                          <div className="bg-rose-950/20 p-6 rounded-2xl border border-rose-900/50 shadow-inner">
                            <h4 className="font-bold text-rose-400 mb-5 flex items-center gap-2 text-lg">
                              <AlertTriangle size={20} /> أسباب المشكلة (التشخيص)
                            </h4>
                            <ul className="space-y-4">
                              {module.problems.map((p, i) => (
                                <li key={i} className="text-sm text-rose-300 flex items-start gap-3 font-medium bg-rose-900/10 p-3 rounded-lg border border-rose-800/20">
                                  <span className="mt-0.5 text-rose-500 shrink-0">⚠️</span> {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-900/50 shadow-inner">
                            <h4 className="font-bold text-emerald-400 mb-5 flex items-center gap-2 text-lg">
                              <CheckCircle2 size={20} /> الحلول المقترحة
                            </h4>
                            <ul className="space-y-4">
                              {module.solutions.map((s, i) => (
                                <li key={i} className="text-sm text-emerald-300 flex items-start gap-3 font-medium bg-emerald-900/10 p-3 rounded-lg border border-emerald-800/20">
                                  <span className="mt-0.5 text-emerald-500 shrink-0">✔</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Arrow between stages */}
                {index < evaluatedModules.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="flex justify-center py-4 text-slate-700 relative"
                  >
                    <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-slate-700 to-transparent -z-10"></div>
                    <div className="bg-slate-950 p-2 rounded-full border border-slate-800 shadow-lg">
                      <ArrowDown size={28} className="text-slate-500" />
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </main>
    </motion.div>
  );
}
