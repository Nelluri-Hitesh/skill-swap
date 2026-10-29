import React, { createContext, useContext, useState } from 'react';
import { ViewMode, CampusEvent, NotificationItem } from '../types';
import { notificationsList } from '../data/mockData';

interface AppContextType {
  activeTab: ViewMode;
  setActiveTab: (tab: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;
  selectedEvent: CampusEvent | null;
  setSelectedEvent: (event: CampusEvent | null) => void;
  isResumeModalOpen: boolean;
  setIsResumeModalOpen: (open: boolean) => void;
  isExplainabilityModalOpen: boolean;
  setIsExplainabilityModalOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  activeAssistantQuery: string;
  setActiveAssistantQuery: (query: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isExplainabilityModalOpen, setIsExplainabilityModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsList);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeAssistantQuery, setActiveAssistantQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isTicketModalOpen,
        setIsTicketModalOpen,
        selectedEvent,
        setSelectedEvent,
        isResumeModalOpen,
        setIsResumeModalOpen,
        isExplainabilityModalOpen,
        setIsExplainabilityModalOpen,
        notifications,
        unreadCount,
        markAllNotificationsRead,
        toastMessage,
        showToast,
        activeAssistantQuery,
        setActiveAssistantQuery,
        sidebarCollapsed,
        setSidebarCollapsed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
