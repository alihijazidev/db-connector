import { MadeWithDyad } from "@/components/made-with-dyad";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap, ArrowLeftCircle, ShieldCheck, Cpu } from "lucide-react";

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-background rounded-3xl border-2 border-primary/5 hover:border-primary/20 transition-all hover:shadow-xl hover:-translate-y-1">
    <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-black text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground text-center leading-relaxed">{description}</p>
  </div>
);

const Index = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-700">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest animate-bounce">
            <Zap className="w-4 h-4 fill-current" /> مرحباً بك في المستقبل
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tighter leading-[1.1]">
            تحكم ببياناتك <br /> <span className="text-primary italic">بذكاء فائق</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            استكشف، اربط، وحلل قواعد بياناتك دون كتابة سطر كود SQL واحد. الحل الأمثل لفرق البيانات العصرية.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-2xl shadow-primary/30">
              <ArrowLeftCircle className="w-6 h-6" />
              ابدأ بإضافة اتصال من القائمة الجانبية
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem 
            icon={Database} 
            title="ربط متعدد" 
            description="اتصل بقواعد بيانات PostgreSQL و MySQL و SQLite في ثوانٍ معدودة."
          />
          <FeatureItem 
            icon={Cpu} 
            title="منشئ مرئي" 
            description="واجهة سحب وإفلات لبناء استعلامات معقدة وعلاقات (Joins) متطورة."
          />
          <FeatureItem 
            icon={ShieldCheck} 
            title="آمن وسريع" 
            description="تشفير كامل لبيانات الاتصال وأداء فائق في معالجة النتائج الضخمة."
          />
        </div>

        <div className="pt-20">
          <MadeWithDyad />
        </div>
      </div>
    </Layout>
  );
};

export default Index;