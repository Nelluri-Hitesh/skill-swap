import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mic01Icon, Cancel01Icon, SparklesIcon, AudioWave01Icon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

export const VoiceModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, setActiveTab, setActiveAssistantQuery, showToast } = useApp();
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('Listening… "How can I apply for leave without dropping below 75% attendance?"');
  const [stage, setStage] = useState<'listening' | 'processing' | 'done'>('listening');

  useEffect(() => {
    if (!isVoiceModalOpen) return;
    setIsListening(true);
    setStage('listening');
    const t1 = setTimeout(() => {
      setStage('processing');
      setTranscript('Processing… routing to Academic & Knowledge agents');
      const t2 = setTimeout(() => {
        setStage('done');
        setTranscript('Query ready: "Leave Application & Attendance Threshold Analysis"');
      }, 2000);
      return () => clearTimeout(t2);
    }, 3000);
    return () => clearTimeout(t1);
  }, [isVoiceModalOpen]);

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,17,23,0.25)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-[400px] bg-bg border border-border rounded-2xl shadow-card-hover p-6 text-center relative"
      >
        <button
          onClick={() => setIsVoiceModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border text-faint hover:text-text hover:bg-surface transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" strokeWidth={2} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-accent-light border border-accent-mid flex items-center justify-center mx-auto mb-4">
          <HugeiconsIcon icon={SparklesIcon} size={22} color="#00ABF0" strokeWidth={1.5} />
        </div>

        <h3 className="text-base font-bold text-text">AgentX Voice Assistant</h3>
        <p className="text-xs text-muted mt-1">Multimodal Campus Intelligence</p>

        {/* Waveform */}
        <div className="my-8 flex items-center justify-center gap-1 h-12">
          {[40, 75, 30, 90, 60, 100, 45, 80, 55, 35, 95, 50].map((h, idx) => (
            <motion.div
              key={idx}
              animate={{ height: isListening ? [`${h * 0.25}%`, `${h}%`, `${h * 0.3}%`] : '15%' }}
              transition={{ duration: 0.7, repeat: Infinity, repeatType: 'mirror', delay: idx * 0.07 }}
              className="w-1 rounded-full bg-accent"
              style={{ minHeight: 4 }}
            />
          ))}
        </div>

        {/* Transcript */}
        <div className="p-3 rounded-xl bg-surface border border-border text-xs text-text font-mono text-left leading-relaxed min-h-[52px]">
          {transcript}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full border transition-all ${
              isListening
                ? 'bg-red-50 text-red-500 border-red-200'
                : 'bg-accent-light text-accent border-accent-mid'
            }`}
          >
            <HugeiconsIcon icon={Mic01Icon} size={18} color="currentColor" strokeWidth={1.5} />
          </button>

          {stage === 'done' && (
            <button
              onClick={() => {
                setActiveAssistantQuery('How can I apply for leave without dropping below 75% attendance?');
                setActiveTab('assistant');
                setIsVoiceModalOpen(false);
                showToast('Voice query sent to AI Assistant');
              }}
              className="btn-primary flex items-center gap-2 px-4 py-2.5"
            >
              <HugeiconsIcon icon={AudioWave01Icon} size={15} color="#fff" strokeWidth={2} />
              Launch AI Response
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
