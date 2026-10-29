import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { VoiceModal } from './components/VoiceModal';
import { TicketModal } from './components/TicketModal';
import { ResumeAnalyzerModal } from './components/ResumeAnalyzerModal';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { Toast } from './components/Toast';

// Views
import { DashboardHome } from './views/DashboardHome';
import { AIAssistantView } from './views/AIAssistantView';
import { MultiAgentView } from './views/MultiAgentView';
import { OrchestratorView } from './views/OrchestratorView';
import { AcademicView } from './views/AcademicView';
import { PlacementView } from './views/PlacementView';
import { EventsView } from './views/EventsView';
import { ServicesView } from './views/ServicesView';
import { KnowledgeRAGView } from './views/KnowledgeRAGView';
import { CommunicationView } from './views/CommunicationView';
import { NotificationsView } from './views/NotificationsView';
import { WorkflowsView } from './views/WorkflowsView';
import { MemoryView } from './views/MemoryView';
import { AnalyticsView } from './views/AnalyticsView';
import { AdminView } from './views/AdminView';
import { ExplainabilityView } from './views/ExplainabilityView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab, sidebarCollapsed } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'assistant':
        return <AIAssistantView />;
      case 'multi-agent':
        return <MultiAgentView />;
      case 'orchestrator':
        return <OrchestratorView />;
      case 'academic':
        return <AcademicView />;
      case 'placement':
        return <PlacementView />;
      case 'events':
        return <EventsView />;
      case 'services':
        return <ServicesView />;
      case 'knowledge':
        return <KnowledgeRAGView />;
      case 'communication':
        return <CommunicationView />;
      case 'notifications':
        return <NotificationsView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'memory':
        return <MemoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'admin':
        return <AdminView />;
      case 'explainability':
        return <ExplainabilityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 bg-grid-pattern relative">
      <Sidebar />
      <Navbar />

      <main
        className={`pt-20 px-6 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {renderActiveView()}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <VoiceModal />
      <TicketModal />
      <ResumeAnalyzerModal />
      <ExplainabilityModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
