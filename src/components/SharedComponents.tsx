import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, CheckCircle2, Info } from 'lucide-react';

export const ThreeDBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  const depth = 12;
  return (
    <g>
      {/* Front face */}
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {/* Top face */}
      <polygon points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${y - depth} ${x + width},${y}`} fill={fill} opacity={0.8} />
      {/* Right face */}
      <polygon points={`${x + width},${y} ${x + width + depth},${y - depth} ${x + width + depth},${y + height - depth} ${x + width},${y + height}`} fill={fill} opacity={0.6} />
    </g>
  );
};

export const Hint = ({ text, type = 'info' }: { text: string, type?: 'info' | 'success' | 'warning' }) => {
  const Icon = type === 'success' ? CheckCircle2 : type === 'warning' ? HelpCircle : Info;
  const colorClass = type === 'success' ? 'text-emerald-500 hover:text-emerald-400' : type === 'warning' ? 'text-amber-500 hover:text-amber-400' : 'text-slate-400 hover:text-indigo-400';
  
  return (
    <span className="group relative inline-flex items-center justify-center mx-1 z-50">
      <Icon size={16} className={`${colorClass} cursor-help transition-all duration-300 hover:scale-110`} />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 w-64 p-3 bg-slate-800/95 backdrop-blur-md text-xs text-slate-200 rounded-xl shadow-2xl border border-slate-700 text-center pointer-events-none transform group-hover:-translate-y-1">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800/95"></span>
      </span>
    </span>
  );
};

export const AnimatedValue = ({ value, suffix = '', prefix = '' }: { value: number, suffix?: string, prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 800;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toFixed(1)}{suffix}</span>;
};

export const InputField = ({ label, value, onChange, hint, prefix = '' }: { label: string, value: number, onChange: (v: number) => void, hint: string, prefix?: string }) => (
  <motion.div whileHover={{ scale: 1.01 }} className="flex flex-col gap-2 relative bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
    <div className="flex items-center justify-between">
      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>
      <Hint text={hint} type="info" />
    </div>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">{prefix}</span>}
      <input 
        type="number" 
        min="0"
        value={value === 0 ? '' : value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full border border-slate-700/50 rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-lg text-slate-100 bg-slate-900/50 focus:bg-slate-900 shadow-inner ${prefix ? 'pl-8 pr-4' : 'px-4'}`}
        dir="ltr"
      />
    </div>
  </motion.div>
);

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-slate-900/60 backdrop-blur-md border border-slate-800/60 rounded-3xl shadow-xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);
