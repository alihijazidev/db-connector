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
              Dynamic Database Connector
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Connect to your databases, explore schemas, and build complex queries without writing a single line of SQL.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center text-lg font-medium text-primary">
                <Database className="w-5 h-5 mr-2" /> Start by adding a connection in the sidebar.
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