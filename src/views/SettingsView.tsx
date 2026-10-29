import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings01Icon, SparklesIcon, BellIcon,
  Shield01Icon, Moon02Icon, BrushIcon, CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';

const tabs = ['General', 'Notifications', 'Privacy', 'AI Model', 'Appearance'] as const;

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('General');
  const [toggles, setToggles] = useState({
    darkMode: false, emailAlerts: true, pushNotifs: true,
    aiMemory: true, biometric: false, analytics: true,
  });

  const toggle = (key: keyof typeof toggles) =>
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const ToggleSwitch = ({ k }: { k: keyof typeof toggles }) => (
    <button
      onClick={() => toggle(k)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${toggles[k] ? 'bg-accent' : 'bg-surface2 border border-border'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${toggles[k] ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-5 pb-12">
      <div>
        <h2 className="section-title">Settings</h2>
        <p className="section-subtitle">Personalise AgentX AI to your campus workflow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Tab nav */}
        <div className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-item w-full px-3 py-2.5 ${activeTab === tab ? 'active' : ''}`}
            >
              <HugeiconsIcon
                icon={{ General: Settings01Icon, Notifications: BellIcon, Privacy: Shield01Icon, 'AI Model': SparklesIcon, Appearance: BrushIcon }[tab]}
                size={15} color="currentColor" strokeWidth={1.5}
              />
              {tab}
            </button>
          ))}
        </div>

        {/* Settings content */}
        <div className="lg:col-span-3 card p-6 space-y-5">
          {activeTab === 'General' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text">General Settings</h3>
              {[
                { label: 'Full Name', value: 'Alex Mercer' },
                { label: 'Roll Number', value: '2023-CS-9420' },
                { label: 'Email', value: 'alex.mercer@university.edu' },
                { label: 'Department', value: 'AI & Computer Science' },
                { label: 'Semester', value: 'Semester VI' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="text-2xs font-semibold text-faint uppercase tracking-wider">{label}</label>
                  <input defaultValue={value} className="input mt-1 w-full px-3 py-2.5 text-sm" />
                </div>
              ))}
              <button onClick={() => showToast('Profile saved!')} className="btn-primary flex items-center gap-2 px-5 py-2.5">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="#fff" strokeWidth={2} />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text">Notification Preferences</h3>
              {[
                { key: 'emailAlerts', label: 'Email Alerts', sub: 'Receive agent actions via email' },
                { key: 'pushNotifs',  label: 'Push Notifications', sub: 'Browser-level instant alerts' },
                { key: 'analytics',  label: 'Weekly AI Reports', sub: 'Digest of agent activity and insights' },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                  <div>
                    <p className="text-xs font-semibold text-text">{label}</p>
                    <p className="text-2xs text-muted mt-0.5">{sub}</p>
                  </div>
                  <ToggleSwitch k={key as keyof typeof toggles} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text">Privacy & Security</h3>
              {[
                { key: 'aiMemory', label: 'AI Persistent Memory', sub: 'Allow agents to remember your context' },
                { key: 'biometric', label: 'Biometric Login', sub: 'Use fingerprint or face ID to log in' },
                { key: 'analytics', label: 'Usage Analytics', sub: 'Share anonymous usage data' },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                  <div>
                    <p className="text-xs font-semibold text-text">{label}</p>
                    <p className="text-2xs text-muted mt-0.5">{sub}</p>
                  </div>
                  <ToggleSwitch k={key as keyof typeof toggles} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'AI Model' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text">AI Model Configuration</h3>
              <div>
                <label className="text-2xs font-semibold text-faint uppercase tracking-wider">Active Model</label>
                <select className="input mt-1 w-full px-3 py-2.5 text-sm">
                  <option>AgentX-DeepMind 4.5 (Default)</option>
                  <option>GPT-4o Enterprise</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Gemini 2.5 Pro</option>
                </select>
              </div>
              <div>
                <label className="text-2xs font-semibold text-faint uppercase tracking-wider">Response Tone</label>
                <select className="input mt-1 w-full px-3 py-2.5 text-sm">
                  <option>Technical & Concise</option>
                  <option>Formal & Academic</option>
                  <option>Conversational</option>
                </select>
              </div>
              <button onClick={() => showToast('AI config saved!')} className="btn-primary flex items-center gap-2 px-5 py-2.5">
                <HugeiconsIcon icon={SparklesIcon} size={14} color="#fff" strokeWidth={2} />
                Save AI Config
              </button>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text">Appearance</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={Moon02Icon} size={18} color="#5c6370" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-semibold text-text">Dark Mode</p>
                    <p className="text-2xs text-muted">Switch to dark theme</p>
                  </div>
                </div>
                <ToggleSwitch k="darkMode" />
              </div>
              <div>
                <label className="text-2xs font-semibold text-faint uppercase tracking-wider mb-2 block">Accent Color</label>
                <div className="flex gap-3">
                  {['#00ABF0', '#7c3aed', '#22c55e', '#f59e0b', '#ef4444'].map(c => (
                    <button
                      key={c}
                      onClick={() => showToast(`Accent set to ${c}`)}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-card-hover transition-transform hover:scale-110"
                      style={{ background: c, boxShadow: `0 0 0 2px ${c}40` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
