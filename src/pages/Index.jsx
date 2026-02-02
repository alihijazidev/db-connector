import React from 'react';
import { Layout } from '@/components/Layout';
import { Database, Zap, Shield, ArrowUpRight, BarChart3, Globe } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, colorClass }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-default overflow-hidden relative">
    <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${colorClass}`} />
    
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-opacity-10 transition-transform group-hover:scale-110 duration-300 ${colorClass} text-white`}>
      <Icon size={28} />
    </div>
    
    <div className="flex items-start justify-between">
      <h3 className="font-black text-slate-800 text-xl mb-3">{title}</h3>
      <ArrowUpRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
    </div>
    
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const Index = () => {
  return (
    <Layout>
      <div className="relative">
        {/* Hero Section */}
        <div className="text-right max-w-3xl mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            تحليل البيانات أصبح أسهل
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.15]">
            بياناتك تتحدث، <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-indigo-400">نحن نساعدك على فهمها</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
            قم بربط قواعد بياناتك المختلفة في مكان واحد، وقم ببناء استعلامات معقدة بدون كتابة سطر كود واحد.
          </p>
        </div>

        {/* Stats / Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'اتصال نشط', val: '24/7', icon: Globe },
            { label: 'وقت الاستجابة', val: '45ms', icon: Zap },
            { label: 'أمان البيانات', val: '100%', icon: Shield },
            { label: 'تقارير يومية', val: 'بصري', icon: BarChart3 },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/5 border border-slate-200 p-5 rounded-3xl flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                <item.icon size={20} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-tight">{item.label}</div>
                <div className="text-lg font-black text-slate-800">{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Database} 
            title="تعدد المصادر" 
            desc="اربط MySQL، PostgreSQL، وSQL Server بكل سهولة وبضغطة زر واحدة."
            colorClass="bg-indigo-600"
          />
          <FeatureCard 
            icon={Zap} 
            title="بناء فوري" 
            desc="محرك ذكي لبناء الاستعلامات يمنحك النتائج في أجزاء من الثانية."
            colorClass="bg-amber-500"
          />
          <FeatureCard 
            icon={Shield} 
            title="حماية مطلقة" 
            desc="بياناتك مشفرة ومحفوظة في متصفحك فقط. نحن لا نطلع على بياناتك أبداً."
            colorClass="bg-emerald-500"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;