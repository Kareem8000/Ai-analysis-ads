import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  ArrowRight, BrainCircuit, AlertTriangle, CheckCircle2, 
  Upload, Download, RefreshCw, Info, ExternalLink, Star, Activity,
  Eye, MousePointerClick, ShoppingCart, CreditCard, ShoppingBag, Palette, ChevronDown, ChevronUp, ArrowDown
} from 'lucide-react';
import { Hint, AnimatedValue, InputField, Card } from './SharedComponents';

export default function CreativeDashboard({ onBack, onNavigate }: { onBack: () => void, onNavigate: (target: 'selection' | 'sales' | 'budget' | 'creative') => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Funnel Inputs
  const [inputs, setInputs] = useState({
    impressions: 100000,
    reach: 80000,
    allClicks: 2500,
    linkClicks: 1500,
    outboundClicks: 1000,
    landingPageViews: 800,
    addToCart: 60,
    checkout: 20,
    purchases: 10,
    videoPlay25: 20000,
    videoPlay50: 10000,
    videoPlay75: 5000,
    frequency: 1.5,
  });

  const [campaignObjective, setCampaignObjective] = useState<'awareness' | 'engagement' | 'sales'>('sales');

  // Meta Standard Rankings
  const [rankings, setRankings] = useState({
    quality: 'average',
    engagement: 'average',
    conversion: 'average',
  });

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleRankingChange = (field: string, value: string) => {
    setRankings(prev => ({ ...prev, [field]: value }));
  };

  // Calculations
  const ctrAll = inputs.impressions > 0 ? (inputs.allClicks / inputs.impressions) * 100 : 0;
  const ctrLink = inputs.impressions > 0 ? (inputs.linkClicks / inputs.impressions) * 100 : 0;
  const ctr = ctrLink; // Keeping existing ctr variable for compatibility

  const videoPlay25Rate = inputs.reach > 0 ? (inputs.videoPlay25 / inputs.reach) * 100 : 0;
  const videoPlay50Rate = inputs.reach > 0 ? (inputs.videoPlay50 / inputs.reach) * 100 : 0;
  const videoPlay75Rate = inputs.reach > 0 ? (inputs.videoPlay75 / inputs.reach) * 100 : 0;

  const outboundRate = inputs.linkClicks > 0 ? (inputs.outboundClicks / inputs.linkClicks) * 100 : 0;
  const lpvRate = inputs.outboundClicks > 0 ? (inputs.landingPageViews / inputs.outboundClicks) * 100 : 0;
  const atcRate = inputs.landingPageViews > 0 ? (inputs.addToCart / inputs.landingPageViews) * 100 : 0;
  const checkoutRate = inputs.addToCart > 0 ? (inputs.checkout / inputs.addToCart) * 100 : 0;
  const purchaseRate = inputs.checkout > 0 ? (inputs.purchases / inputs.checkout) * 100 : 0;

  const getRankingScore = (ranking: string) => {
    if (ranking === 'above_average') return 100;
    if (ranking === 'average') return 50;
    return 20;
  };
  
  const qualityScore = getRankingScore(rankings.quality);
  const engagementScore = getRankingScore(rankings.engagement);
  const conversionScore = getRankingScore(rankings.conversion);
  const ctrScore = Math.min(100, Math.max(0, (ctrAll / 2) * 100));
  const overallCreativeScore = Math.round((qualityScore + engagementScore + conversionScore + ctrScore) / 4);

  const getVideoPlayEval = (rate: number) => {
    if (rate > 20) return { text: 'ممتاز', color: 'text-emerald-400 bg-emerald-500/10' };
    if (rate >= 10) return { text: 'جيد (يحتاج تحسين)', color: 'text-amber-400 bg-amber-500/10' };
    return { text: 'سيء جداً (يحتاج تغيير)', color: 'text-rose-400 bg-rose-500/10' };
  };

  const getCtrAllEval = (rate: number) => {
    if (rate > 2) return { text: 'ممتاز (الكريتيف يعمل جيداً)', color: 'text-emerald-400 bg-emerald-500/10' };
    if (rate >= 1) return { text: 'جيد (يحتاج تحسين)', color: 'text-amber-400 bg-amber-500/10' };
    return { text: 'مشكلة في الكريتيف أو الاستهداف', color: 'text-rose-400 bg-rose-500/10' };
  };

  const getFrequencyEval = (freq: number, objective: string) => {
    if (objective === 'awareness') {
      if (freq >= 5 && freq <= 7) return { text: 'طبيعي جداً', color: 'text-emerald-400 bg-emerald-500/10' };
      return { text: 'خارج النطاق الطبيعي (5-7)', color: 'text-amber-400 bg-amber-500/10' };
    }
    if (objective === 'engagement') {
      if (freq >= 2 && freq <= 4) return { text: 'طبيعي', color: 'text-emerald-400 bg-emerald-500/10' };
      return { text: 'خارج النطاق الطبيعي (2-4)', color: 'text-amber-400 bg-amber-500/10' };
    }
    if (objective === 'sales') {
      if (freq <= 3) return { text: 'جيد (التكلفة لن تزيد)', color: 'text-emerald-400 bg-emerald-500/10' };
      return { text: 'مرتفع (قد تزيد التكلفة)', color: 'text-rose-400 bg-rose-500/10' };
    }
    return { text: 'غير محدد', color: 'text-slate-400 bg-slate-500/10' };
  };

  const getRankingsAnalysis = (q: string, e: string, c: string) => {
    const isHighQ = q === 'above_average' || q === 'average';
    const isHighE = e === 'above_average' || e === 'average';
    const isHighC = c === 'above_average' || c === 'average';

    if (isHighQ && !isHighE && !isHighC) {
      return { 
        title: 'جودة عالية، تفاعل وتحويل ضعيف', 
        desc: 'نسخة الإعلان (Copy) جيدة، لكن نسبة النقر (CTR) ضعيفة ورسالة الإعلان غير واضحة.', 
        color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' 
      };
    }
    if (!isHighQ && isHighE && !isHighC) {
      return { 
        title: 'تفاعل عالي، جودة وتحويل ضعيف', 
        desc: 'الإعلان يجذب الانتباه ولكنه غير مقنع. يتجاهل الناس إعلاناتك (جودة منخفضة) ولا توجد تحويلات.', 
        color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' 
      };
    }
    if (!isHighQ && !isHighE && isHighC) {
      return { 
        title: 'تحويل عالي، جودة وتفاعل ضعيف', 
        desc: 'الإعلان سيء أو ضعيف، لكن الناس يعرفون منتجك أو علامتك التجارية فدخلوا واشتروا.', 
        color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' 
      };
    }
    if (!isHighQ && isHighE && isHighC) {
      return { 
        title: 'تفاعل وتحويل عالي، جودة ضعيفة', 
        desc: 'الإعلان والتحويلات جيدة، لكن قد يكون المنافسون تعمدوا الإضرار بك (مثل إخفاء المنشور أو التفاعل السلبي) مما أدى لانخفاض الجودة.', 
        color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' 
      };
    }
    if (isHighQ && !isHighE && isHighC) {
      return { 
        title: 'جودة وتحويل عالي، تفاعل ضعيف', 
        desc: 'هذا طبيعي جداً في حملات المبيعات. ما يميز حملات المبيعات هو الجودة العالية والتحويل العالي.', 
        color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' 
      };
    }
    if (isHighQ && isHighE && !isHighC) {
      return { 
        title: 'جودة وتفاعل عالي، تحويل ضعيف', 
        desc: 'لديك مشكلة في الـ CTA (الدعوة لاتخاذ إجراء) الخاص بالحملة، أو أن سعر المنتج غير واضح في الإعلان.', 
        color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' 
      };
    }
    if (isHighQ && isHighE && isHighC) {
      return { 
        title: 'أداء مثالي', 
        desc: 'أداء ممتاز من جميع النواحي. استمر في التوسع وزيادة الميزانية.', 
        color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' 
      };
    }
    if (!isHighQ && !isHighE && !isHighC) {
      return { 
        title: 'أداء ضعيف جداً', 
        desc: 'أداء سيء جداً. أوقف الإعلان فوراً وراجع الكريتيف والعرض.', 
        color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' 
      };
    }

    return { 
      title: 'أداء متباين', 
      desc: 'راجع المؤشرات الفردية لمعرفة الخلل بدقة.', 
      color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' 
    };
  };

  // 10-Second Diagnosis Logic
  let diagnosis = {
    stage: 'All Good',
    message: 'الأداء ممتاز في جميع المراحل. استمر في التوسع (Scaling).',
    action: 'budget',
    actionText: 'اذهب إلى تحليل الميزانية',
    color: 'emerald',
    icon: CheckCircle2
  };

  if (ctr < 1) {
    diagnosis = {
      stage: 'الكريتيف (Creative)',
      message: 'نسبة النقر (CTR) ضعيفة جداً (أقل من 1%). المشكلة في الإعلان نفسه (الهوك، الفيديو، أو الرسالة).',
      action: 'creative',
      actionText: 'تحليل الكريتيف',
      color: 'purple',
      icon: Palette
    };
  } else if (outboundRate < 70 || lpvRate < 70) {
    diagnosis = {
      stage: 'الدخول للموقع (Website Entry)',
      message: 'الناس تضغط على الإعلان لكن لا تصل للموقع. المشكلة في سرعة الموقع أو الرابط (Link/Speed).',
      action: 'sales',
      actionText: 'تحليل مسار المبيعات',
      color: 'orange',
      icon: MousePointerClick
    };
  } else if (atcRate < 10) {
    diagnosis = {
      stage: 'صفحة المنتج (Product Page)',
      message: 'الناس تدخل الموقع لكن لا تضيف للسلة. المشكلة في السعر، الصور، أو وصف المنتج.',
      action: 'sales',
      actionText: 'تحليل مسار المبيعات',
      color: 'rose',
      icon: ShoppingCart
    };
  } else if (checkoutRate < 50) {
    diagnosis = {
      stage: 'نموذج الطلب (Checkout Form)',
      message: 'إضافات السلة جيدة لكن الوصول للدفع ضعيف. المشكلة في طول الفورم أو تعقيد المنصة.',
      action: 'sales',
      actionText: 'تحليل مسار المبيعات',
      color: 'amber',
      icon: CreditCard
    };
  } else if (purchaseRate < 50) {
    diagnosis = {
      stage: 'الدفع (Payment)',
      message: 'الوصول للدفع جيد لكن الشراء ضعيف. المشكلة في بوابات الدفع، الضرائب، أو خيارات الدفع.',
      action: 'sales',
      actionText: 'تحليل مسار المبيعات',
      color: 'red',
      icon: ShoppingBag
    };
  }

  const evaluateModule = (rate: number, thresholds: { good: number, bad: number }) => {
    if (rate >= thresholds.good) return { level: 3, text: 'ممتاز', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (rate >= thresholds.bad) return { level: 2, text: 'متوسط', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { level: 1, text: 'ضعيف', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  const modules = [
    {
      id: 'creative',
      title: 'الكريتيف (Creative)',
      hint: 'مدى جاذبية الإعلان وقدرته على لفت الانتباه.',
      icon: Palette,
      color: 'purple',
      rate: ctr,
      equationText: '(Link Clicks / Impressions) * 100',
      equationValues: `${inputs.linkClicks} / ${inputs.impressions}`,
      evalResult: evaluateModule(ctr, { good: 1.5, bad: 1 }),
      problems: [
        'الهوك (Hook) في أول 3 ثوانٍ غير جذاب.',
        'الرسالة الإعلانية غير واضحة أو لا تهم الجمهور.',
        'جودة الفيديو أو التصميم ضعيفة.',
        'الـ Call to Action (CTA) غير واضح.'
      ],
      solutions: [
        'اختبر 3 هوكات (Hooks) مختلفة لنفس الفيديو.',
        'ركز على مشكلة العميل والحل الذي تقدمه.',
        'استخدم نصوص واضحة ومقروءة على الفيديو.',
        'اجعل الـ CTA مباشراً (مثال: تسوق الآن، احصل على العرض).'
      ],
      details: 'نسبة النقر (CTR) هي المؤشر الأول لنجاح الإعلان. إذا كانت أقل من 1%، فهذا يعني أن الإعلان يفشل في إيقاف تصفح المستخدم (Scroll-stopping). يجب التركيز على تحسين الهوك والرسالة قبل زيادة الميزانية.'
    },
    {
      id: 'website_entry',
      title: 'الدخول للموقع (Website Entry)',
      hint: 'نسبة الأشخاص الذين نقروا على الإعلان وانتظروا تحميل الموقع.',
      icon: MousePointerClick,
      color: 'orange',
      rate: lpvRate,
      equationText: '(Landing Page Views / Outbound Clicks) * 100',
      equationValues: `${inputs.landingPageViews} / ${inputs.outboundClicks}`,
      evalResult: evaluateModule(lpvRate, { good: 80, bad: 70 }),
      problems: [
        'سرعة تحميل الموقع بطيئة جداً (أكثر من 3 ثوانٍ).',
        'الرابط في الإعلان معطل أو يوجه لصفحة خاطئة.',
        'عدم تطابق بين الإعلان وصفحة الهبوط (Clickbait).',
        'مشاكل تقنية في تتبع البيكسل.'
      ],
      solutions: [
        'ضغط الصور واستخدام صيغ حديثة مثل WebP.',
        'تقليل استخدام الإضافات (Plugins) غير الضرورية.',
        'التأكد من أن صفحة الهبوط تعكس نفس رسالة الإعلان.',
        'استخدام أدوات مثل Google PageSpeed Insights لتحسين السرعة.'
      ],
      details: 'هذه المرحلة تقيس "التسرب" بين النقر والوصول الفعلي. نسبة أقل من 70% تعني أنك تدفع مقابل نقرات لا تصل لموقعك، وغالباً ما يكون السبب هو بطء التحميل أو تجربة مستخدم سيئة على الموبايل.'
    },
    {
      id: 'product_page',
      title: 'صفحة المنتج (Product Page)',
      hint: 'مدى إقناع صفحة المنتج للزائر بإضافة المنتج للسلة.',
      icon: ShoppingCart,
      color: 'rose',
      rate: atcRate,
      equationText: '(Add to Cart / Landing Page Views) * 100',
      equationValues: `${inputs.addToCart} / ${inputs.landingPageViews}`,
      evalResult: evaluateModule(atcRate, { good: 15, bad: 10 }),
      problems: [
        'السعر غير مناسب أو غير واضح.',
        'صور المنتج ضعيفة أو لا تظهر التفاصيل.',
        'وصف المنتج غير مقنع أو يفتقر للفوائد.',
        'زر "أضف للسلة" غير واضح أو يصعب العثور عليه.',
        'عدم وجود تقييمات أو إثبات اجتماعي (Social Proof).'
      ],
      solutions: [
        'إبراز السعر والخصومات بشكل واضح.',
        'استخدام صور عالية الجودة وفيديوهات توضيحية للمنتج.',
        'كتابة وصف يركز على الفوائد (Benefits) وليس فقط الميزات (Features).',
        'جعل زر "أضف للسلة" بلون متباين وواضح.',
        'إضافة تقييمات حقيقية للعملاء.'
      ],
      details: 'معدل الإضافة للسلة (ATC Rate) يقيس مدى جاذبية العرض. إذا كان الزوار يصلون للموقع ولا يضيفون للسلة، فالمشكلة غالباً في العرض نفسه (السعر، المنتج، أو طريقة العرض).'
    },
    {
      id: 'checkout_form',
      title: 'نموذج الطلب (Checkout Form)',
      hint: 'نسبة الأشخاص الذين بدأوا عملية الدفع بعد إضافة المنتج للسلة.',
      icon: CreditCard,
      color: 'amber',
      rate: checkoutRate,
      equationText: '(Checkout / Add to Cart) * 100',
      equationValues: `${inputs.checkout} / ${inputs.addToCart}`,
      evalResult: evaluateModule(checkoutRate, { good: 60, bad: 50 }),
      problems: [
        'نموذج الطلب طويل ومعقد ويطلب معلومات غير ضرورية.',
        'تكاليف شحن مفاجئة أو غير واضحة من البداية.',
        'عدم توفر خيارات دفع مفضلة للعميل.',
        'مخاوف أمنية وعدم وجود شارات ثقة (Trust Badges).'
      ],
      solutions: [
        'تبسيط نموذج الطلب وتقليل الحقول المطلوبة (الاسم، الرقم، العنوان فقط إن أمكن).',
        'توضيح تكاليف الشحن في صفحة المنتج أو تقديم شحن مجاني.',
        'توفير خيارات دفع متعددة (الدفع عند الاستلام، بطاقات ائتمان، Apple Pay).',
        'إضافة شارات ثقة وضمانات الاسترجاع.'
      ],
      details: 'التسرب في هذه المرحلة غالباً ما يكون بسبب "صدمة السعر" (تكاليف إضافية مفاجئة) أو "الاحتكاك" (نموذج معقد). تبسيط هذه الخطوة يمكن أن يرفع المبيعات بشكل كبير.'
    },
    {
      id: 'payment',
      title: 'الدفع (Payment)',
      hint: 'نسبة الأشخاص الذين أكملوا عملية الشراء بنجاح.',
      icon: ShoppingBag,
      color: 'emerald',
      rate: purchaseRate,
      equationText: '(Purchases / Checkout) * 100',
      equationValues: `${inputs.purchases} / ${inputs.checkout}`,
      evalResult: evaluateModule(purchaseRate, { good: 60, bad: 50 }),
      problems: [
        'رفض البطاقات الائتمانية من قبل بوابة الدفع.',
        'أعطال تقنية في صفحة الدفع.',
        'عدم توفر خيار "الدفع عند الاستلام" في أسواق تعتمد عليه.',
        'تردد العميل في اللحظة الأخيرة.'
      ],
      solutions: [
        'التأكد من عمل بوابات الدفع بشكل سليم واختبارها دورياً.',
        'تقديم خيار الدفع عند الاستلام (COD) إذا كان مناسباً لسوقك.',
        'استخدام رسائل تذكير (Retargeting) للذين تخلوا عن الدفع.',
        'تقديم دعم فني فوري (Live Chat) في صفحة الدفع.'
      ],
      details: 'هذه هي الخطوة الأخيرة والأهم. إذا كان التسرب هنا عالياً، يجب مراجعة الجانب التقني لبوابات الدفع وتوفير خيارات بديلة لتسهيل العملية على العميل.'
    }
  ];

  const evaluatedModules = modules;
  const weakestModule = [...evaluatedModules].sort((a, b) => a.evalResult.level - b.evalResult.level)[0];
  const hasWeakness = weakestModule.evalResult.level <= 2;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const data: any = results.data[0];
            setInputs({
              impressions: Number(data.Impressions || data.impressions || inputs.impressions),
              linkClicks: Number(data['Link Clicks'] || data.linkClicks || inputs.linkClicks),
              outboundClicks: Number(data['Outbound Clicks'] || data.outboundClicks || inputs.outboundClicks),
              landingPageViews: Number(data['Landing Page Views'] || data.landingPageViews || inputs.landingPageViews),
              addToCart: Number(data['Adds to Cart'] || data.addToCart || inputs.addToCart),
              checkout: Number(data['Checkouts Initiated'] || data.checkout || inputs.checkout),
              purchases: Number(data.Purchases || data.purchases || inputs.purchases),
            });
          }
        }
      });
    }
  };

  const exportData = () => {
    const csvContent = `Stage,Value,Rate
Impressions,${inputs.impressions},-
Link Clicks,${inputs.linkClicks},${ctr.toFixed(2)}%
Outbound Clicks,${inputs.outboundClicks},${outboundRate.toFixed(2)}%
Landing Page Views,${inputs.landingPageViews},${lpvRate.toFixed(2)}%
Add to Cart,${inputs.addToCart},${atcRate.toFixed(2)}%
Checkout,${inputs.checkout},${checkoutRate.toFixed(2)}%
Purchases,${inputs.purchases},${purchaseRate.toFixed(2)}%
Diagnosis Stage,${diagnosis.stage},-
Diagnosis Message,${diagnosis.message},-`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "creative_diagnosis_report.csv");
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
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-purple-400 to-pink-400 flex items-center gap-2">
                <BrainCircuit className="text-purple-400" />
                تحليل الكريتيف والتشخيص
              </h1>
              <p className="text-xs text-slate-400 font-medium">اكتشف المشكلة في 10 ثوانٍ</p>
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
            <button onClick={exportData} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-purple-500/20">
              <Download size={16} />
              تصدير التقرير
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* 10-Second Diagnosis Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`bg-${diagnosis.color}-900/20 border border-${diagnosis.color}-500/30 p-8 rounded-3xl relative overflow-hidden`}
        >
          <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-${diagnosis.color}-500 to-transparent`} />
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className={`p-6 bg-${diagnosis.color}-500/20 rounded-full border border-${diagnosis.color}-500/30 shrink-0`}>
              <diagnosis.icon className={`text-${diagnosis.color}-400`} size={64} />
            </div>
            <div className="flex-grow text-center md:text-right">
              <h2 className="text-3xl font-black text-white mb-2">
                مكان المشكلة: <span className={`text-${diagnosis.color}-400`}>{diagnosis.stage}</span>
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                {diagnosis.message}
              </p>
              <button 
                onClick={() => onNavigate(diagnosis.action as any)}
                className={`inline-flex items-center gap-2 bg-${diagnosis.color}-600 hover:bg-${diagnosis.color}-500 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-${diagnosis.color}-500/20`}
              >
                {diagnosis.actionText}
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="text-purple-400" size={20} />
                بيانات المسار (Funnel Data)
              </h3>
              <div className="space-y-4">
                <InputField label="الوصول (Reach)" value={inputs.reach} onChange={(v) => handleInputChange('reach', v)} hint="عدد الأشخاص الفريدين الذين شاهدوا الإعلان." />
                <InputField label="الظهور (Impressions)" value={inputs.impressions} onChange={(v) => handleInputChange('impressions', v)} hint="عدد مرات ظهور الإعلان." />
                <InputField label="كل النقرات (All Clicks)" value={inputs.allClicks} onChange={(v) => handleInputChange('allClicks', v)} hint="إجمالي النقرات على الإعلان (تفاعل، تعليق، رابط)." />
                <InputField label="النقرات (Link Clicks)" value={inputs.linkClicks} onChange={(v) => handleInputChange('linkClicks', v)} hint="عدد النقرات على رابط الإعلان." />
                <InputField label="النقرات الصادرة (Outbound)" value={inputs.outboundClicks} onChange={(v) => handleInputChange('outboundClicks', v)} hint="النقرات التي أدت للخروج من المنصة." />
                <InputField label="زيارات الموقع (Landing Page Views)" value={inputs.landingPageViews} onChange={(v) => handleInputChange('landingPageViews', v)} hint="عدد مرات تحميل صفحة الهبوط بنجاح." />
                <InputField label="إضافة للسلة (Add to Cart)" value={inputs.addToCart} onChange={(v) => handleInputChange('addToCart', v)} hint="عدد مرات إضافة منتج للسلة." />
                <InputField label="بدء الدفع (Checkout)" value={inputs.checkout} onChange={(v) => handleInputChange('checkout', v)} hint="عدد مرات الوصول لصفحة الدفع." />
                <InputField label="المشتريات (Purchases)" value={inputs.purchases} onChange={(v) => handleInputChange('purchases', v)} hint="عدد عمليات الشراء الناجحة." />
                
                <div className="pt-4 border-t border-slate-800/50">
                  <h4 className="text-sm font-bold text-slate-400 mb-4">مشاهدات الفيديو (Video Plays)</h4>
                  <InputField label="مشاهدة 25%" value={inputs.videoPlay25} onChange={(v) => handleInputChange('videoPlay25', v)} hint="عدد مرات مشاهدة 25% من الفيديو." />
                  <InputField label="مشاهدة 50%" value={inputs.videoPlay50} onChange={(v) => handleInputChange('videoPlay50', v)} hint="عدد مرات مشاهدة 50% من الفيديو." />
                  <InputField label="مشاهدة 75%" value={inputs.videoPlay75} onChange={(v) => handleInputChange('videoPlay75', v)} hint="عدد مرات مشاهدة 75% من الفيديو." />
                </div>
                
                <div className="pt-4 border-t border-slate-800/50">
                  <h4 className="text-sm font-bold text-slate-400 mb-4">التكرار (Frequency)</h4>
                  <InputField label="التكرار (Frequency)" value={inputs.frequency} onChange={(v) => handleInputChange('frequency', v)} hint="متوسط عدد مرات ظهور الإعلان للشخص الواحد." />
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-slate-400 mb-2">هدف الحملة (Campaign Objective)</label>
                    <select 
                      value={campaignObjective} 
                      onChange={(e) => setCampaignObjective(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="awareness">وعي بالعلامة التجارية (Awareness)</option>
                      <option value="engagement">تفاعل (Engagement)</option>
                      <option value="sales">مبيعات (Sales)</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                مؤشرات جودة الإعلان (Meta Rankings)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">تصنيف الجودة (Quality Ranking)</label>
                  <select 
                    value={rankings.quality} 
                    onChange={(e) => handleRankingChange('quality', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="above_average">أعلى من المتوسط (Above Average)</option>
                    <option value="average">متوسط (Average)</option>
                    <option value="below_average">أقل من المتوسط (Below Average)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">تصنيف التفاعل (Engagement Rate)</label>
                  <select 
                    value={rankings.engagement} 
                    onChange={(e) => handleRankingChange('engagement', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="above_average">أعلى من المتوسط (Above Average)</option>
                    <option value="average">متوسط (Average)</option>
                    <option value="below_average">أقل من المتوسط (Below Average)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">تصنيف التحويل (Conversion Rate)</label>
                  <select 
                    value={rankings.conversion} 
                    onChange={(e) => handleRankingChange('conversion', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="above_average">أعلى من المتوسط (Above Average)</option>
                    <option value="average">متوسط (Average)</option>
                    <option value="below_average">أقل من المتوسط (Below Average)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-400">نقاط الكريتيف (Creative Score)</h4>
                  <Hint text="درجة من 100 تقيس جودة الإعلان بناءً على نسبة النقر وتصنيفات ميتا." type="info" />
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-black ${overallCreativeScore >= 80 ? 'text-emerald-400' : overallCreativeScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    <AnimatedValue value={overallCreativeScore} />
                  </span>
                  <span className="text-slate-500 font-bold mb-1">/ 100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${overallCreativeScore}%` }} 
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${overallCreativeScore >= 80 ? 'bg-emerald-500' : overallCreativeScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Analysis Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard title="نسبة النقر (CTR Link)" value={ctrLink} suffix="%" threshold={1} isGood={ctrLink >= 1} hint="أقل من 1% يعني مشكلة في الكريتيف." />
              <MetricCard title="نسبة الخروج (Outbound)" value={outboundRate} suffix="%" threshold={70} isGood={outboundRate >= 70} hint="نسبة النقرات التي وصلت للموقع فعلياً." />
              <MetricCard title="نسبة الإضافة للسلة (ATC)" value={atcRate} suffix="%" threshold={10} isGood={atcRate >= 10} hint="يجب أن تكون بين 10% و 30%." />
              <MetricCard title="نسبة الوصول للدفع (Checkout)" value={checkoutRate} suffix="%" threshold={50} isGood={checkoutRate >= 50} hint="أقل من 50% يعني مشكلة في نموذج الطلب." />
              <MetricCard title="نسبة الشراء (Purchase)" value={purchaseRate} suffix="%" threshold={50} isGood={purchaseRate >= 50} hint="أقل من 50% يعني مشكلة في بوابات الدفع." />
            </div>

            {/* Advanced Creative Analysis */}
            <Card className="p-0 mt-6 border-purple-500/30 shadow-2xl shadow-purple-500/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-6 border-b border-purple-500/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <BrainCircuit className="text-purple-400" size={24} />
                  </div>
                  تحليل الكريتيف المتقدم (Advanced Creative Analysis)
                </h3>
                <p className="text-slate-400 text-sm mt-2 mr-14">
                  تحليل عميق لمشاهدات الفيديو، التفاعل، وتصنيفات ميتا لاستخراج رؤى دقيقة حول أداء الإعلان.
                </p>
              </div>
              
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Video Plays */}
                <div className="space-y-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-blue-400" />
                    تحليل مشاهدات الفيديو (Video Plays)
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">مشاهدة 25% (الهوك)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{videoPlay25Rate.toFixed(1)}%</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${getVideoPlayEval(videoPlay25Rate).color}`}>
                          {getVideoPlayEval(videoPlay25Rate).text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">مشاهدة 50% (الاحتفاظ)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{videoPlay50Rate.toFixed(1)}%</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${getVideoPlayEval(videoPlay50Rate).color}`}>
                          {getVideoPlayEval(videoPlay50Rate).text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">مشاهدة 75% (الاهتمام)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{videoPlay75Rate.toFixed(1)}%</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${getVideoPlayEval(videoPlay75Rate).color}`}>
                          {getVideoPlayEval(videoPlay75Rate).text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    * يتم حساب النسبة بناءً على الوصول (Reach). نسبة 50% أو أعلى تعتبر ممتازة.
                  </p>
                </div>

                {/* CTR & Frequency */}
                <div className="space-y-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
                    <MousePointerClick size={18} className="text-indigo-400" />
                    التفاعل والتكرار (Engagement & Frequency)
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">نسبة التفاعل (CTR All)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{ctrAll.toFixed(2)}%</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${getCtrAllEval(ctrAll).color}`}>
                          {getCtrAllEval(ctrAll).text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">التكرار (Frequency)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{inputs.frequency.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold ${getFrequencyEval(inputs.frequency, campaignObjective).color}`}>
                          {getFrequencyEval(inputs.frequency, campaignObjective).text}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800/50">
                    <h5 className="text-xs font-bold text-slate-400 mb-3">تحليل تصنيفات ميتا (Meta Rankings):</h5>
                    {(() => {
                      const analysis = getRankingsAnalysis(rankings.quality, rankings.engagement, rankings.conversion);
                      return (
                        <div className={`p-4 rounded-xl border ${analysis.bg} ${analysis.border}`}>
                          <h6 className={`font-bold text-sm mb-1 ${analysis.color}`}>{analysis.title}</h6>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {analysis.desc}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6 border-slate-800/60">
              <h3 className="text-xl font-bold text-white mb-6">خريطة تساقط العملاء (Drop-off Map)</h3>
              <div className="relative pt-8 pb-4 px-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-slate-700 to-slate-800 w-full" />
                </div>
                
                <div className="flex justify-between relative z-10">
                  <DropoffNode label="الظهور" value={inputs.impressions} isProblem={false} />
                  <DropoffNode label="النقرات" value={inputs.linkClicks} isProblem={ctr < 1} />
                  <DropoffNode label="الموقع" value={inputs.landingPageViews} isProblem={ctr >= 1 && lpvRate < 70} />
                  <DropoffNode label="السلة" value={inputs.addToCart} isProblem={ctr >= 1 && lpvRate >= 70 && atcRate < 10} />
                  <DropoffNode label="الدفع" value={inputs.checkout} isProblem={ctr >= 1 && lpvRate >= 70 && atcRate >= 10 && checkoutRate < 50} />
                  <DropoffNode label="الشراء" value={inputs.purchases} isProblem={ctr >= 1 && lpvRate >= 70 && atcRate >= 10 && checkoutRate >= 50 && purchaseRate < 50} />
                </div>
              </div>
            </Card>

            {/* Funnel Modules */}
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BrainCircuit className="text-purple-400" />
                التحليل التفصيلي للمسار
              </h3>
              
              {evaluatedModules.map((module, index) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className={`bg-slate-900/50 border ${expandedModule === module.id ? `border-${module.color}-500/50 shadow-lg shadow-${module.color}-500/10` : 'border-slate-800/50'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  {/* Module Header (Clickable) */}
                  <div 
                    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                    className="p-5 cursor-pointer flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${module.evalResult.color}`}>
                        <module.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white flex items-center gap-2">
                          {module.title}
                          <Hint text={module.hint} type="info" />
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${module.evalResult.color}`}>
                            {module.evalResult.text}
                          </span>
                          <span className="text-sm text-slate-400 font-mono">
                            {module.rate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {module.evalResult.level === 1 && (
                        <div className="flex items-center gap-1 text-rose-400 text-sm font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                          <AlertTriangle size={14} />
                          تسرب عالي
                        </div>
                      )}
                      {expandedModule === module.id ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                    </div>
                  </div>

                  {/* Module Content (Expandable) */}
                  <AnimatePresence>
                    {expandedModule === module.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-800/50 bg-slate-950/50"
                      >
                        <div className="p-6 grid md:grid-cols-2 gap-8">
                          {/* Left Col: Details & Equation */}
                          <div className="space-y-6">
                            <div>
                              <h5 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">التفاصيل</h5>
                              <p className="text-slate-300 leading-relaxed text-sm">{module.details}</p>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                              <h5 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">طريقة الحساب</h5>
                              <div className="font-mono text-sm text-slate-300 mb-1">{module.equationText}</div>
                              <div className="font-mono text-xs text-slate-500">{module.equationValues} = {module.rate.toFixed(2)}%</div>
                            </div>
                          </div>

                          {/* Right Col: Problems & Solutions */}
                          <div className="space-y-6">
                            {module.evalResult.level <= 2 && (
                              <div>
                                <h5 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                                  <AlertTriangle size={16} />
                                  المشاكل المحتملة
                                </h5>
                                <ul className="space-y-2">
                                  {module.problems.map((prob, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                      {prob}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div>
                              <h5 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                الحلول المقترحة
                              </h5>
                              <ul className="space-y-2">
                                {module.solutions.map((sol, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    {sol}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, suffix, threshold, isGood, hint }: { title: string, value: number, suffix: string, threshold: number, isGood: boolean, hint: string }) {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border ${isGood ? 'border-slate-700/50' : 'border-rose-500/50 shadow-lg shadow-rose-500/10'} relative group overflow-hidden transition-all hover:scale-[1.02]`}>
      <div className={`absolute top-0 right-0 w-full h-1 ${isGood ? 'bg-emerald-500/20' : 'bg-rose-500/50'}`} />
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-bold text-slate-400">{title}</h4>
        <Hint text={hint} type={isGood ? 'success' : 'warning'} />
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-black tracking-tight ${isGood ? 'text-white' : 'text-rose-400'}`}>
          <AnimatedValue value={value} />{suffix}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-medium">
        <span className={isGood ? 'text-emerald-400' : 'text-rose-400'}>
          {isGood ? 'أداء جيد' : 'يحتاج انتباه'}
        </span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-500">الهدف: {threshold}{suffix}</span>
      </div>
    </div>
  );
}

function DropoffNode({ label, value, isProblem }: { label: string, value: number, isProblem: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all duration-300 group-hover:scale-110 ${isProblem ? 'bg-rose-900/50 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-900 border-slate-700 text-slate-300 group-hover:border-slate-500 group-hover:text-white'}`}>
        {value > 1000 ? (value / 1000).toFixed(1) + 'k' : value}
      </div>
      <span className={`text-xs font-bold transition-colors ${isProblem ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{label}</span>
    </div>
  );
}
