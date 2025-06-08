import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsNavigation } from '@/components/settings/SettingsNavigation';
import { SectionInfo } from '@/components/settings/SectionInfo';
import { SettingsSubNavigation } from '@/components/settings/SettingsSubNavigation';
import { SettingsContent } from '@/components/settings/SettingsContent';
import { sections } from '@/data/settingsConfig';
const Settings = () => {
  const [activeSection, setActiveSection] = useState('pessoas');
  const userProfile = 'ADMIN_MASTER'; // This would come from auth context

  return <div className="min-h-screen bg-zinc-200">
      <SettingsHeader />

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <SettingsNavigation sections={sections} userProfile={userProfile} />

          {sections.map(section => <TabsContent key={section.id} value={section.id} className="space-y-6">
              <SectionInfo section={section} />

              <Tabs defaultValue={section.items[0]?.id} className="space-y-4">
                <SettingsSubNavigation items={section.items} />

                {section.items.map(item => <TabsContent key={item.id} value={item.id}>
                    <SettingsContent sectionId={section.id} itemId={item.id} />
                  </TabsContent>)}
              </Tabs>
            </TabsContent>)}
        </Tabs>
      </div>
    </div>;
};
export default Settings;