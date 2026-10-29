import React from 'react';
import { agentsData } from '../data/mockData';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  GraduationCap,
  Briefcase,
  PartyPopper,
  Building2,
  BookOpen,
  Mail,
  Bell,
  Settings2,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-5 h-5 text-[#00E5FF]" />,
  Briefcase: <Briefcase className="w-5 h-5 text-purple-400" />,
  PartyPopper: <PartyPopper className="w-5 h-5 text-emerald-400" />,
  Building2: <Building2 className="w-5 h-5 text-amber-400" />,
  BookOpen: <BookOpen className="w-5 h-5 text-indigo-400" />,
  Mail: <Mail className="w-5 h-5 text-rose-400" />,
  Bell: <Bell className="w-5 h-5 text-[#00E5FF]" />,
  Settings2: <Settings2 className="w-5 h-5 text-purple-400" />
};

export const MultiAgentView: React.FC = () => {
  const { showToast, setIsExplainabilityModalOpen } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl glass-panel-glow border border-[#00E5FF]/40">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#00E5FF] font-bold uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>Real-time Multi-Agent Swarm</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Multi-Agent Network Monitor</h1>
          <p className="text-xs text-slate-400 mt-1">
            8 Autonomous domain agents executing in parallel with zero human bottleneck.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => showToast('Swarm Diagnostics Refreshed: All 8 Agents Synced')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:border-[#00E5FF] flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Sync Swarm</span>
          </button>
        </div>
      </div>

      {/* 8 Premium Agent Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {agentsData.map((agent) => (
          <motion.div
            key={agent.id}
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Glow Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#00E5FF]/15 transition-all" />

            <div>
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {iconMap[agent.icon] || <Cpu className="w-5 h-5 text-[#00E5FF]" />}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {agent.status}
                  </span>
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-slate-100">{agent.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{agent.type}</p>

              {/* Progress Ring / Metric Ring */}
              <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Model Accuracy</span>
                  <span className="font-black text-[#00E5FF]">{agent.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#00E5FF] to-purple-500 h-full rounded-full"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>

              {/* Current Activity Box */}
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]">
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Active Execution</div>
                <div className="text-slate-300 font-medium truncate">{agent.currentActivity}</div>
              </div>

              {/* Tasks & Response Time Stats */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-center text-[10px]">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400">Tasks Solved</div>
                  <div className="font-bold text-slate-200 mt-0.5">{agent.tasksCompleted}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400">Latency</div>
                  <div className="font-bold text-[#00E5FF] mt-0.5">{agent.responseTimeMs}ms</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-purple-400 font-semibold">{agent.metricsValue}</span>
              <button
                onClick={() => setIsExplainabilityModalOpen(true)}
                className="text-[10px] text-[#00E5FF] hover:underline font-semibold flex items-center"
              >
                Inspect Weights <Sparkles className="w-3 h-3 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
