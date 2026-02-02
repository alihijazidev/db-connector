import React from 'react';
import { Layout } from '@/components/Layout';
import { Database, Zap, Shield } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Index = () => {
  return (
    <Layout>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          أدر بياناتك بذكاء <br /> <span className="text-indigo-600">وبدون تعقيد</span>
        </h1>
        <p className="text-lg text-slate-600">
          منصة داتا-مايند تتيح لك ربط واستكشاف قواعد بياناتك في ثوانٍ. ابدأ بإضافة اتصال جديد من القائمة الجانبية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Database} 
          title="ربط سريع" 
          desc="دعم كامل لقواعد البيانات الأكثر شهرة مع إعداد فوري."
        />
        <FeatureCard 
          icon={Zap} 
          title="أداء عالٍ" 
          desc="معالجة سريعة جداً للبيانات الضخمة والنتائج المعقدة."
        />
        <FeatureCard 
          icon={Shield} 
          title="أمان تام" 
          desc="تشفير بيانات الاتصال وحفظها محلياً في متصفحك فقط."
        />
      </div>
    </Layout>
  );
};

export default Index;