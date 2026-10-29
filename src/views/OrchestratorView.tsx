import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  WorkflowCircle01Icon, SparklesIcon, CpuIcon,
  CheckmarkCircle02Icon, Clock01Icon, FlashIcon,
  ArrowDown01Icon, AiBrain01Icon, Shield01Icon,
} from '@hugeicons/core-free-icons';
import { sampleWorkflowSteps } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const stepStatus = {
  completed: { badge: 'badge-green', dot: 'bg-green-500', icon: CheckmarkCircle02Icon },
  active:    { badge: 'badge-blue',  dot: 'bg-accent animate-pulse', icon: FlashIcon },
  pending:   { badge: 'badge-blue',  dot: 'bg-surface2 border border-border', icon: Clock01Icon },
};

const agentIcons: Record<string, any> = {
  Orchestrator: WorkflowCircle01Icon,
  Academic:     SparklesIcon,
  'Knowledge RAG': AiBrain01Icon,
  Communication: Shield01Icon,
};

export const OrchestratorView: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Orchestrator</h2>
          <p className="section-subtitle">Multi-agent task planning, delegation, and execution pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot bg-green-500" />
          <span className="text-xs text-muted font-medium">Pipeline Active</span>
        </div>
      </div>

      {/* Current task */}
      <div className="card p-5 border-accent/20 bg-gradient-to-br from-white to-accent-light">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="badge badge-blue mb-2">Live Task</span>
            <h3 className="text-base font-bold text-text">Leave Application Automation</h3>
            <p className="text-xs text-muted mt-1">Routing through 4-agent pipeline · Initiated 2 min ago</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-accent">75%</p>
            <p className="text-2xs text-faint">Complete</p>
          </div>
        </div>
        <div className="progress-track h-2">
          <div className="progress-fill h-full" style={{ width: '75%' }} />
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text mb-5 flex items-center gap-2">
          <HugeiconsIcon icon={WorkflowCircle01Icon} size={14} color="#00ABF0" strokeWidth={1.5} />
          Agent Pipeline Steps
        </h3>
        <div className="space-y-3">
          {sampleWorkflowSteps.map((step: any, idx: number) => {
            const status = (step.status as keyof typeof stepStatus) || 'pending';
            const { badge, icon } = stepStatus[status];
            const AgentIcon = agentIcons[step.agent] ?? CpuIcon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
              >
                {/* Step number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  status === 'completed' ? 'bg-green-100 text-green-600 border border-green-200' :
                  status === 'active'    ? 'bg-accent-light text-accent border border-accent-mid' :
                  'bg-surface2 text-faint border border-border'
                }`}>
                  {status === 'completed'
                    ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} color="currentColor" strokeWidth={2.5} />
                    : idx + 1
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={AgentIcon} size={13} color="#00ABF0" strokeWidth={1.5} />
                      <p className="text-xs font-semibold text-text">{step.title}</p>
                    </div>
                    <span className={`badge ${badge} flex-shrink-0`}>{step.status}</span>
                  </div>
                  <p className="text-2xs text-muted mt-1">{step.description}</p>
                  <p className="text-2xs text-faint mt-1.5 flex items-center gap-1">
                    <HugeiconsIcon icon={CpuIcon} size={10} color="currentColor" strokeWidth={1.5} />
                    Agent: {step.agent} · {step.duration}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Pipelines Run', value: '1,284', color: 'text-accent',    icon: WorkflowCircle01Icon },
          { label: 'Success Rate',        value: '98.2%', color: 'text-green-600', icon: CheckmarkCircle02Icon },
          { label: 'Avg Pipeline Time',   value: '2.6s',  color: 'text-purple-600',icon: Clock01Icon },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card p-4 text-center">
            <HugeiconsIcon icon={icon} size={18} color="currentColor" strokeWidth={1.5} className={`mx-auto mb-2 ${color}`} />
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-2xs text-faint mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
