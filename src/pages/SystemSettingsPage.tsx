import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import PageLayout from '../layout/PageLayout';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    taxRate: 9.25,
    currency: 'USD',
    receiptFooter: 'Gracias por su orden 🙏',
    autoLogoutTime: 30,
    enableSounds: true,
    enableNotifications: true,
    darkMode: false,
    language: 'en'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage for now
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        taxRate: 9.25,
        currency: 'USD',
        receiptFooter: 'Gracias por su orden 🙏',
        autoLogoutTime: 30,
        enableSounds: true,
        enableNotifications: true,
        darkMode: false,
        language: 'en'
      });
    }
  };

  return (
    <PageLayout pageTitle="System Settings" showBackButton={true}>
      <div className="w-full">

        <div className="rounded-lg shadow overflow-hidden" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Configuration</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <RefreshCw size={16} />
                Reset
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white'
                }}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Financial Settings */}
            <div className="pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Financial Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="MXN">MXN ($)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Receipt Settings */}
            <div className="pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Receipt Settings</h3>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Receipt Footer Message
                </label>
                <textarea
                  value={settings.receiptFooter}
                  onChange={(e) => setSettings({...settings, receiptFooter: e.target.value})}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter footer message for receipts"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
              </div>
            </div>

            {/* Security Settings */}
            <div className="pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Security Settings</h3>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Auto Logout Time (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.autoLogoutTime}
                  onChange={(e) => setSettings({...settings, autoLogoutTime: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                />
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Automatically log out inactive users after this time
                </p>
              </div>
            </div>

            {/* User Interface Settings */}
            <div className="pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>User Interface</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Enable Sound Effects</label>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Play sounds for button clicks and notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableSounds}
                      onChange={(e) => setSettings({...settings, enableSounds: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                         style={{
                           backgroundColor: settings.enableSounds ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                           borderColor: 'var(--border-color)'
                         }}></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Enable Notifications</label>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Show system notifications and alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                         style={{
                           backgroundColor: settings.enableNotifications ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                           borderColor: 'var(--border-color)'
                         }}></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</label>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Use dark theme for the interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                         style={{
                           backgroundColor: settings.darkMode ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                           borderColor: 'var(--border-color)'
                         }}></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>System Information</h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Version:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>1.0.0</span>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Last Updated:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Database:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>Connected</span>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Environment:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>Development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SystemSettingsPage;