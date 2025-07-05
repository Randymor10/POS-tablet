import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Save, RefreshCw } from 'lucide-react';
import KioskLayout from '../layout/KioskLayout';

const SystemSettingsPage: React.FC = () => {
  const navigate = useNavigate();
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
    <KioskLayout>
      <div className="w-full max-w-none px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors shadow"
          >
            <ArrowLeft size={20} />
            Back to POS
          </button>
          <h1 className="text-2xl font-bold text-text-primary">System Settings</h1>
        </div>

        <div className="bg-bg-secondary rounded-lg shadow border border-border-color overflow-hidden">
          <div className="px-6 py-4 border-b border-border-color flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-text-muted" />
              <h2 className="text-lg font-semibold text-text-primary">Configuration</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-2 px-4 py-2 bg-text-muted text-white rounded-lg hover:bg-text-secondary transition-colors"
              >
                <RefreshCw size={16} />
                Reset
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Financial Settings */}
            <div className="border-b border-border-color pb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Financial Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-border-color rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full p-3 border border-border-color rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
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
            <div className="border-b border-border-color pb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Receipt Settings</h3>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Receipt Footer Message
                </label>
                <textarea
                  value={settings.receiptFooter}
                  onChange={(e) => setSettings({...settings, receiptFooter: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-border-color rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                  placeholder="Enter footer message for receipts"
                />
              </div>
            </div>

            {/* Security Settings */}
            <div className="border-b border-border-color pb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Security Settings</h3>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Auto Logout Time (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.autoLogoutTime}
                  onChange={(e) => setSettings({...settings, autoLogoutTime: parseInt(e.target.value)})}
                  className="w-full p-3 border border-border-color rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                />
                <p className="text-sm text-text-muted mt-1">
                  Automatically log out inactive users after this time
                </p>
              </div>
            </div>

            {/* User Interface Settings */}
            <div className="border-b border-border-color pb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">User Interface</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Enable Sound Effects</label>
                    <p className="text-sm text-text-muted">Play sounds for button clicks and notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableSounds}
                      onChange={(e) => setSettings({...settings, enableSounds: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-color after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Enable Notifications</label>
                    <p className="text-sm text-text-muted">Show system notifications and alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-color after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Dark Mode</label>
                    <p className="text-sm text-text-muted">Use dark theme for the interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-color after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full p-3 border border-border-color rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
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
              <h3 className="text-lg font-medium text-text-primary mb-4">System Information</h3>
              <div className="bg-bg-tertiary p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-text-secondary">Version:</span>
                    <span className="ml-2 text-text-muted">1.0.0</span>
                  </div>
                  <div>
                    <span className="font-medium text-text-secondary">Last Updated:</span>
                    <span className="ml-2 text-text-muted">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-text-secondary">Database:</span>
                    <span className="ml-2 text-text-muted">Connected</span>
                  </div>
                  <div>
                    <span className="font-medium text-text-secondary">Environment:</span>
                    <span className="ml-2 text-text-muted">Development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KioskLayout>
  );
};

export default SystemSettingsPage;