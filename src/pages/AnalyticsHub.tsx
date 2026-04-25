import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Analytics from './Analytics';
import Insights from './Insights';
import Reports from './Reports';
import { BarChart3, Sparkles, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnalyticsHub() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('analytics');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t.analytics.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.analytics.subtitle}
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-muted/60 border border-border h-10 p-1 rounded-lg">
          <TabsTrigger
            value="analytics"
            className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-4 h-8"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-4 h-8"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">{t.insights.title}</span>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-4 h-8"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <Analytics />
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          <Insights />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
