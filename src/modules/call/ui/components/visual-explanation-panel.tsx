'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Info, ArrowRight, Divide } from 'lucide-react';
import type { VisualExplanationData } from '@/modules/call/lib/visual-explanation';

interface VisualExplanationPanelProps {
  data: VisualExplanationData | null;
  onClose: () => void;
}

export function VisualExplanationPanel({ data, onClose }: VisualExplanationPanelProps) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          key="visual-explanation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="fixed left-3 bottom-32 sm:bottom-36 sm:left-6 z-30 max-w-xs sm:max-w-sm md:max-w-md"
        >
          <div className="relative rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-900/90 text-white shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_55%)]" />

            <div className="flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary/80">AI Visual Explanation</p>
                  <h3 className="text-base font-semibold leading-tight">{data.title}</h3>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-4 pb-4 pt-2">
              {data.summary && (
                <p className="text-xs text-white/70 leading-relaxed mb-3">{data.summary}</p>
              )}

              <div className="rounded-2xl bg-white/5 p-3 sm:p-4 border border-white/10">
                {renderVisual(data)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function renderVisual(data: VisualExplanationData) {
  switch (data.type) {
    case 'equation':
      return renderEquation(data);
    case 'flowchart':
      return renderFlowchart(data);
    case 'comparison':
      return renderComparison(data);
    case 'timeline':
      return renderTimeline(data);
    case 'list':
      return renderList(data);
    default:
      return renderConceptMap(data);
  }
}

function renderEquation(data: VisualExplanationData) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-slate-900/90 border border-white/10 px-4 py-3 text-lg font-semibold text-primary-foreground shadow-inner">
        <Divide className="mr-2 inline-block h-4 w-4 text-primary" />
        {data.equation ?? 'Equation unavailable'}
      </div>
      {data.items && (
        <ul className="grid grid-cols-2 gap-2 text-xs text-white/70">
          {data.items.map((item) => (
            <li key={item.id} className="rounded-lg bg-white/5 px-2 py-1.5">
              <span className="font-semibold text-white/90">{item.label}</span>
              {item.detail && <span className="block text-[0.7rem] text-white/60">{item.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function renderFlowchart(data: VisualExplanationData) {
  const items = data.items ?? [];
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
            {index + 1}
          </div>
          <div className="rounded-xl bg-white/5 px-3 py-2 text-sm">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderComparison(data: VisualExplanationData) {
  const left = (data.items ?? []).filter((item) => item.id.startsWith('left'));
  const right = (data.items ?? []).filter((item) => item.id.startsWith('right'));

  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
        <h4 className="mb-2 text-sm font-semibold text-primary/80">Option A</h4>
        <ul className="space-y-2 text-white/80">
          {left.map((item) => (
            <li key={item.id} className="rounded-lg bg-white/5 px-2 py-1">{item.label}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-blue-400/40 bg-blue-400/10 p-3">
        <h4 className="mb-2 text-sm font-semibold text-blue-200/90">Option B</h4>
        <ul className="space-y-2 text-white/80">
          {right.map((item) => (
            <li key={item.id} className="rounded-lg bg-white/5 px-2 py-1">{item.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function renderTimeline(data: VisualExplanationData) {
  const steps = data.steps ?? [];
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={`${step.label}-${index}`} className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/80">
            {index + 1}
          </div>
          <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/85">
            <p className="font-medium">{step.label}</p>
            {step.description && <p className="text-xs text-white/70">{step.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderList(data: VisualExplanationData) {
  const items = data.items ?? [];
  return (
    <ul className="space-y-2 text-sm text-white/85">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2">
          <ArrowRight className="mt-1 h-3 w-3 text-primary" />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function renderConceptMap(data: VisualExplanationData) {
  const items = data.items ?? [];
  return (
    <div className="grid grid-cols-1 gap-2 text-sm">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          {item.label}
        </div>
      ))}
    </div>
  );
}

