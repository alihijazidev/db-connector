import { MadeWithDyad } from "@/components/made-with-dyad";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <Card className="w-full max-w-3xl p-8 rounded-3xl shadow-2xl border-4 border-primary/10">
          <CardHeader className="space-y-4">
            <Zap className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <CardTitle className="text-5xl font-extrabold text-foreground">
              موصل قواعد البيانات الذكي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              اتصل بقواعد بياناتك، استكشف الجداول، وابنِ استعلامات معقدة بسهولة دون الحاجة لكتابة كود SQL.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center text-lg font-medium text-primary">
                <Database className="w-5 h-5 ms-2" /> ابدأ بإضافة اتصال جديد من القائمة الجانبية.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default Index;