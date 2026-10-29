import React from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-bg border border-border rounded-xl shadow-card-hover text-xs text-text font-medium"
        >
          <span className="w-6 h-6 rounded-lg bg-accent-light border border-accent-mid flex items-center justify-center flex-shrink-0">
            <HugeiconsIcon icon={SparklesIcon} size={13} color="#00ABF0" strokeWidth={1.5} />
          </span>
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
