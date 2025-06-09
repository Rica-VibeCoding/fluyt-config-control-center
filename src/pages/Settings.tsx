
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsNavigation } from '@/components/settings/SettingsNavigation';
import { SectionInfo } from '@/components/settings/SectionInfo';
import { SettingsSubNavigation } from '@/components/settings/SettingsSubNavigation';
import { SettingsContent } from '@/components/settings/SettingsContent';
import { sections } from '@/data/settingsConfig';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('pessoas');
  const userProfile = 'ADMIN_MASTER'; // This would come from auth context

  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader />

      <div className="productivity-container py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="productivity-section">
          <SettingsNavigation sections={sections} userProfile={userProfile} />

          {sections.map(section => (
            <TabsContent key={section.id} value={section.id} className="productivity-section animate-fade-in">
              <SectionInfo section={section} />

              <Tabs defaultValue={section.items[0]?.id} className="space-y-6">
                <SettingsSubNavigation items={section.items} />

                {section.items.map(item => (
                  <TabsContent key={item.id} value={item.id} className="animate-fade-in">
                    <SettingsContent sectionId={section.id} itemId={item.id} />
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
