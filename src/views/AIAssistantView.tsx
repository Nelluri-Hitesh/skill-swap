import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AiChatIcon, MailSend01Icon, Mic01Icon, SparklesIcon,
  Copy01Icon, CheckmarkCircle02Icon, BinaryCodeIcon,
  ArrowDown01Icon, UserIcon,
} from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  citations?: string[];
  agentsUsed?: string[];
  codeSnippet?: string;
  reasoningScore?: number;
}

export const AIAssistantView: React.FC = () => {
  const { activeAssistantQuery, setActiveAssistantQuery, setIsVoiceModalOpen, setIsExplainabilityModalOpen, showToast } = useApp();
  const [model, setModel] = useState('AgentX-DeepMind 4.5');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: "Hello Alex! I'm **AgentX**, your Smart Campus Copilot. I coordinate 8 specialized AI agents (Academic, Placement, Events, Services, RAG, Communication, Notifications, Orchestrator) to solve complex campus tasks. How can I help you?",
      timestamp: '09:15 AM',
      agentsUsed: ['Orchestrator Agent'],
      reasoningScore: 99.8,
    },
  ]);

  useEffect(() => {
    if (activeAssistantQuery) {
      handleSend(activeAssistantQuery);
      setActiveAssistantQuery('');
    }
  }, [activeAssistantQuery]);

  const handleSend = (text?: string) => {
    const msg = text || inputText;
    if (!msg.trim() || isGenerating) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      let reply = 'I have analysed your query across the **2026 Academic Ordinance** and campus database.';
      let agents = ['Academic Agent', 'Knowledge (RAG) Agent'];
      let code: string | undefined;

      if (msg.toLowerCase().includes('attendance') || msg.toLowerCase().includes('leave')) {
        reply = "Your **CS401 attendance is 88%**. Missing 2 lectures for the hackathon leaves you at **82.5%** — safely above the 75% cutoff.\n\nDuty leave exemption (Clause 4.2) applies. I've drafted your official leave application for Dr. Alan Turing.";
      } else if (msg.toLowerCase().includes('resume') || msg.toLowerCase().includes('ats') || msg.toLowerCase().includes('openai')) {
        reply = 'Your ATS Resume score for **OpenAI AI Systems Drive** is **94/100**. Keywords matched: `PyTorch`, `CUDA`, `Transformers`, `RAG`. Suggestion: add quantified latency benchmark metrics.';
        agents = ['Placement Agent', 'Knowledge (RAG) Agent'];
        code = `# PyTorch Quantization Benchmark\nimport torch\nmodel = torch.hub.load('pytorch/vision', 'resnet50')\nquant = torch.quantization.quantize_dynamic(\n    model, {torch.nn.Linear}, dtype=torch.qint8\n)\nprint("Latency reduced by 42.5%")`;
      }

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentsUsed: agents,
        codeSnippet: code,
        reasoningScore: 99.4,
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Code copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4">
      {/* Header bar */}
      <div className="card flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-light border border-accent-mid flex items-center justify-center">
            <HugeiconsIcon icon={AiChatIcon} size={18} color="#00ABF0" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text">AgentX AI Studio</h2>
            <p className="text-2xs text-muted">Autonomous Multi-Agent Campus Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="input text-xs px-3 py-1.5 pr-8 cursor-pointer"
          >
            <option>AgentX-DeepMind 4.5</option>
            <option>GPT-4o Enterprise</option>
            <option>Claude 3.5 Sonnet RAG</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto card p-4 space-y-4">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-lg bg-accent-light border border-accent-mid flex items-center justify-center flex-shrink-0 mt-1">
                <HugeiconsIcon icon={AiChatIcon} size={14} color="#00ABF0" strokeWidth={1.5} />
              </div>
            )}

            <div className={`max-w-[70%] rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-accent text-white rounded-tr-sm'
                : 'bg-surface border border-border text-text rounded-tl-sm'
            }`}>
              <div className="flex items-center justify-between gap-4 text-2xs mb-1.5 opacity-70">
                <span className="font-semibold">{msg.sender === 'user' ? 'Alex Mercer' : 'AgentX'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.codeSnippet && (
                <div className="mt-3 rounded-xl bg-[#0f1117] overflow-hidden border border-border/20">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                    <span className="flex items-center gap-1.5 text-2xs text-slate-400">
                      <HugeiconsIcon icon={BinaryCodeIcon} size={12} color="#00ABF0" strokeWidth={1.5} />
                      Python
                    </span>
                    <button onClick={() => copyCode(msg.id, msg.codeSnippet!)} className="text-2xs text-slate-400 hover:text-white flex items-center gap-1">
                      <HugeiconsIcon icon={copiedId === msg.id ? CheckmarkCircle02Icon : Copy01Icon} size={11} color="currentColor" strokeWidth={2} />
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-3 text-cyan-300 font-mono text-2xs overflow-x-auto leading-relaxed">{msg.codeSnippet}</pre>
                </div>
              )}

              {msg.sender === 'agent' && (
                <div className="mt-3 pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-2xs">
                  <div className="flex flex-wrap gap-1">
                    {msg.agentsUsed?.map(a => (
                      <span key={a} className="badge badge-blue">{a}</span>
                    ))}
                  </div>
                  <button onClick={() => setIsExplainabilityModalOpen(true)} className="text-accent hover:underline font-medium flex items-center gap-1">
                    <HugeiconsIcon icon={SparklesIcon} size={11} color="currentColor" strokeWidth={1.5} />
                    Why? ({msg.reasoningScore}%)
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 mt-1">
                <HugeiconsIcon icon={UserIcon} size={14} color="#5c6370" strokeWidth={1.5} />
              </div>
            )}
          </motion.div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-muted italic">
            <HugeiconsIcon icon={SparklesIcon} size={14} color="#00ABF0" strokeWidth={1.5} className="animate-spin" />
            AgentX is synthesizing multi-agent reasoning…
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); handleSend(); }}
        className="card flex items-center gap-2 p-2"
      >
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask about subjects, placements, gate pass, campus regulations…"
          className="flex-1 bg-transparent text-sm text-text placeholder-faint outline-none py-1.5 px-2"
        />
        <button type="button" onClick={() => setIsVoiceModalOpen(true)} className="p-2 rounded-lg border border-border text-muted hover:text-accent hover:border-accent/50 transition-all">
          <HugeiconsIcon icon={Mic01Icon} size={15} color="currentColor" strokeWidth={1.5} />
        </button>
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 disabled:opacity-50"
        >
          Send <HugeiconsIcon icon={MailSend01Icon} size={13} color="#fff" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
};
