import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, FileEditIcon, CheckmarkCircle02Icon, Alert01Icon, SparklesIcon, Upload01Icon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

export const ResumeAnalyzerModal: React.FC = () => {
  const { isResumeModalOpen, setIsResumeModalOpen, showToast } = useApp();
  const [analyzing, setAnalyzing] = useState(false);

  const handleSimulateUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      showToast('ATS Resume Analysis Updated: 94/100 Score!');
    }, 1500);
  };

  if (!isResumeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,17,23,0.25)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-[480px] bg-bg border border-border rounded-2xl shadow-card-hover p-6 relative"
      >
        <button
          onClick={() => setIsResumeModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border text-faint hover:text-text hover:bg-surface transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <HugeiconsIcon icon={FileEditIcon} size={20} color="#7c3aed" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text">AI ATS Resume Optimizer</h3>
            <p className="text-xs text-muted">Targeted for OpenAI & Google DeepMind Drives</p>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'ATS Match Score', value: '94%', color: 'text-accent' },
            { label: 'Keywords Found',  value: '18/20', color: 'text-green-600' },
            { label: 'Formatting Rank', value: 'A+',   color: 'text-purple-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-3 text-center">
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-2xs text-faint mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-100 text-green-800">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} color="#16a34a" strokeWidth={2} className="mt-0.5 flex-shrink-0" />
            <span><strong>Strong Technical Fit:</strong> PyTorch, CUDA, Transformers, Distributed Training matched.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">
            <HugeiconsIcon icon={Alert01Icon} size={15} color="#d97706" strokeWidth={2} className="mt-0.5 flex-shrink-0" />
            <span><strong>AI Suggestion:</strong> Add quantitative latency metrics (e.g., "Reduced LLM latency 45% via TensorRT").</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-border">
          <button
            onClick={handleSimulateUpload}
            disabled={analyzing}
            className="btn-ghost flex items-center gap-2 px-4 py-2"
          >
            <HugeiconsIcon icon={analyzing ? Refresh01Icon : Upload01Icon} size={14} color="currentColor" strokeWidth={2} className={analyzing ? 'animate-spin' : ''} />
            {analyzing ? 'Scanning…' : 'Re-upload Resume'}
          </button>

          <button
            onClick={() => { showToast('Resume submitted to Placement Portal'); setIsResumeModalOpen(false); }}
            className="btn-primary flex items-center gap-2 px-4 py-2.5"
          >
            <HugeiconsIcon icon={SparklesIcon} size={14} color="#fff" strokeWidth={2} />
            Apply to Live Drive
          </button>
        </div>
      </motion.div>
    </div>
  );
};
