import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import Analytics from './Analytics';
import Insights from './Insights';
import Reports from './Reports';
import { Icon3D } from '@/shared/components/ui/Icon3D';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

export default function AnalyticsHub() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('analytics');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          {t.analytics.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.analytics.subtitle}
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <TabsList className="bg-muted/60 border border-border h-10 p-1 rounded-lg w-max sm:w-auto inline-flex">
            <TabsTrigger
              value="analytics"
              className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-3 sm:px-4 h-8 whitespace-nowrap"
            >
              <Icon3D name="analytics" className="h-5 w-5" />
              <span>{t.extra?.analyticsTab ?? 'Analytics'}</span>
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-3 sm:px-4 h-8 whitespace-nowrap"
            >
              <Icon3D name="brain" className="h-5 w-5" />
              <span>{t.insights.title}</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-3 sm:px-4 h-8 whitespace-nowrap"
            >
              <Icon3D name="journal" className="h-5 w-5" />
              <span>{t.extra?.reportsTab ?? 'Reports'}</span>
            </TabsTrigger>
          </TabsList>
        </div>

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

