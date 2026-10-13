import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowUp, ArrowDown, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { DEFAULT_WIDGETS } from '../data/initialData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetCustomizerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { widgets, setWidgets } = useApp();

  if (!isOpen) return null;

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= widgets.length) return;
    const copy = [...widgets];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);
    setWidgets(copy.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const resetWidgets = () => {
    setWidgets(DEFAULT_WIDGETS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personalize Dashboard Layout
            </h3>
            <p className="text-xs text-slate-500">
              Reorder or show/hide dashboard analytics widgets to suit your workflow.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 my-4 max-h-96 overflow-y-auto">
          {widgets.map((widget, idx) => (
            <div
              key={widget.id}
              className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {widget.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Width: {widget.width === 'full' ? 'Full Width' : 'Half Column'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => moveWidget(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveWidget(idx, 'down')}
                  disabled={idx === widgets.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleWidget(widget.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${
                    widget.enabled
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                  title={widget.enabled ? 'Enabled' : 'Hidden'}
                >
                  {widget.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={resetWidgets}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
