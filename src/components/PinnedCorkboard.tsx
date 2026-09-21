import React, { useState } from 'react';
import { Pin, Plus, Trash2, Edit3, Check, X, Sparkles, Filter } from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import { PinnedNote } from '../types';

interface PinnedCorkboardProps {
  filterTarget?: 'all' | 'overview' | 'klinfitz' | 'zanzibar' | 'poultry' | 'utt' | 'loan' | 'diary';
  compact?: boolean;
  title?: string;
}

const PIN_COLORS = {
  gold: {
    badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700',
    card: 'bg-[#FFFDF7] dark:bg-[#1E1C18] border-amber-200 dark:border-amber-900/60 shadow-amber-900/5',
    pinIcon: 'text-amber-600 dark:text-amber-400 fill-amber-500',
    label: 'Gold Pin',
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700',
    card: 'bg-[#F7FDF9] dark:bg-[#16221D] border-emerald-200 dark:border-emerald-900/60 shadow-emerald-900/5',
    pinIcon: 'text-emerald-600 dark:text-emerald-400 fill-emerald-500',
    label: 'Emerald Pin',
  },
  coral: {
    badge: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700',
    card: 'bg-[#FFF9F9] dark:bg-[#251717] border-rose-200 dark:border-rose-900/60 shadow-rose-900/5',
    pinIcon: 'text-rose-600 dark:text-rose-400 fill-rose-500',
    label: 'Coral Pin',
  },
  indigo: {
    badge: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-700',
    card: 'bg-[#F8FAFD] dark:bg-[#161D27] border-sky-200 dark:border-sky-900/60 shadow-sky-900/5',
    pinIcon: 'text-sky-600 dark:text-sky-400 fill-sky-500',
    label: 'Indigo Pin',
  },
};

export const PinnedCorkboard: React.FC<PinnedCorkboardProps> = ({
  filterTarget = 'all',
  compact = false,
  title = 'Pinned Notes & Focus Reminders',
}) => {
  const { state, addPinnedNote, updatePinnedNote, deletePinnedNote, togglePinDiaryEntry, setActiveTab } = useKairos();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('Founder Memo');
  const [newColor, setNewColor] = useState<'gold' | 'emerald' | 'coral' | 'indigo'>('gold');
  const [newTarget, setNewTarget] = useState<PinnedNote['target']>(
    filterTarget !== 'all' ? (filterTarget as PinnedNote['target']) : 'overview'
  );

  // Filtered Notes
  const pinnedNotes = (state.pinnedNotes || []).filter((note) =>
    filterTarget === 'all' ? true : note.target === filterTarget
  );

  // Pinned Diary Entries
  const pinnedDiary = (state.diaryEntries || []).filter((entry) => entry.isPinned);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addPinnedNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor.trim() || 'Me',
      pinColor: newColor,
      target: newTarget,
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="rounded-3xl border border-amber-200/80 bg-[#FCFBF7] p-6 sm:p-7 dark:border-amber-900/40 dark:bg-[#181715] shadow-xs relative overflow-hidden">
      {/* Decorative corkboard top accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-4 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            <Pin className="h-4 w-4 fill-amber-600" />
          </div>
          <div>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{title}</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-mono-num font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {pinnedNotes.length + (filterTarget === 'all' || filterTarget === 'diary' ? pinnedDiary.length : 0)} pinned
              </span>
            </h3>
            <p className="font-serif-body text-xs text-stone-600 dark:text-stone-400">
              Attach strategic reminders, operating rules, and sticky notes across your chapters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A2F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Attach New Pin</span>
        </button>
      </div>

      {/* New Pin Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="mt-4 rounded-2xl border-2 border-dashed border-amber-300 bg-white p-4 dark:border-amber-800/80 dark:bg-stone-900 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              <Pin className="h-3.5 w-3.5 fill-amber-500" />
              <span>New Sticky Pin</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">Pin Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Golden Rule #2 or Alice Follow-up"
                required
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">Author / Tag</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g., Mom & I, Memo, Operations"
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">Pin Content & Memo</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={2}
              placeholder="Write your rule, milestone note, or strategic observation..."
              required
              className="w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              {/* Color Selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-500 font-medium">Color:</span>
                {(Object.keys(PIN_COLORS) as Array<keyof typeof PIN_COLORS>).map((colorKey) => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setNewColor(colorKey)}
                    className={`h-5 w-5 rounded-full border transition-transform ${
                      newColor === colorKey ? 'scale-125 ring-2 ring-stone-900 dark:ring-stone-100' : 'opacity-70 hover:opacity-100'
                    } ${
                      colorKey === 'gold'
                        ? 'bg-amber-400 border-amber-600'
                        : colorKey === 'emerald'
                        ? 'bg-emerald-400 border-emerald-600'
                        : colorKey === 'coral'
                        ? 'bg-rose-400 border-rose-600'
                        : 'bg-sky-400 border-sky-600'
                    }`}
                  />
                ))}
              </div>

              {/* Target Chapter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-500 font-medium">Chapter:</span>
                <select
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value as PinnedNote['target'])}
                  className="rounded-lg border border-stone-300 bg-stone-50 px-2 py-1 text-[11px] text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                >
                  <option value="overview">Overview</option>
                  <option value="klinfitz">Klin Fitz</option>
                  <option value="zanzibar">Zanzibar</option>
                  <option value="poultry">Poultry</option>
                  <option value="utt">UTT / Wealth</option>
                  <option value="loan">Loan Service</option>
                  <option value="diary">Diary</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg px-3 py-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-[#1E3A2F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <Check className="h-3 w-3" />
                <span>Pin to Board</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Pinned Cards */}
      <div className={`mt-5 grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
        {/* Pinned Sticky Notes */}
        {pinnedNotes.map((note) => {
          const colorCfg = PIN_COLORS[note.pinColor || 'gold'];
          const isEditing = editingId === note.id;

          return (
            <div
              key={note.id}
              className={`group relative rounded-2xl border p-4.5 transition-all hover:shadow-md ${colorCfg.card}`}
            >
              {/* Pushpin Tack Badge */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="inline-flex items-center gap-1.5">
                  <Pin className={`h-4 w-4 transform -rotate-12 ${colorCfg.pinIcon}`} />
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorCfg.badge}`}>
                    {note.target}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono-num text-stone-400">{note.createdAt}</span>
                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : note.id)}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    title="Edit Note"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePinnedNote(note.id)}
                    className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors"
                    title="Unpin Note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    defaultValue={note.title}
                    onBlur={(e) => updatePinnedNote(note.id, { title: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 bg-white dark:bg-stone-900 px-2 py-1 text-xs font-bold text-stone-900 dark:text-stone-100"
                  />
                  <textarea
                    defaultValue={note.content}
                    rows={2}
                    onBlur={(e) => updatePinnedNote(note.id, { content: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 bg-white dark:bg-stone-900 p-2 text-xs text-stone-800 dark:text-stone-200"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-500">Author: {note.author}</span>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded bg-stone-800 text-white px-2 py-0.5 text-[10px] font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                    {note.title}
                  </h4>
                  <p className="mt-1 font-serif-body text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                  {note.author && (
                    <div className="mt-3 flex items-center justify-between border-t border-stone-200/50 dark:border-stone-800/60 pt-2 text-[11px]">
                      <span className="font-handwriting text-stone-600 dark:text-stone-400">
                        — {note.author}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Pinned Diary Highlights (if in overview/diary/all mode) */}
        {(filterTarget === 'all' || filterTarget === 'diary' || filterTarget === 'overview') &&
          pinnedDiary.map((entry) => (
            <div
              key={`diary-${entry.id}`}
              className="group relative rounded-2xl border border-amber-200/90 bg-[#FFFDF8] p-4.5 dark:border-amber-900/60 dark:bg-[#1C1B18] shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5">
                  <Pin className="h-4 w-4 fill-amber-500 text-amber-600 transform -rotate-12" />
                  <span className="rounded-full bg-amber-100/90 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    Pinned Diary Entry
                  </span>
                  {entry.mood && (
                    <span className="text-xs">{entry.mood}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono-num text-stone-400">{entry.date}</span>
                  <button
                    type="button"
                    onClick={() => togglePinDiaryEntry(entry.id)}
                    className="p-1 rounded text-stone-400 hover:text-amber-700 dark:hover:text-amber-300"
                    title="Unpin Diary Entry"
                  >
                    <Pin className="h-3.5 w-3.5 fill-amber-400" />
                  </button>
                </div>
              </div>

              <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                {entry.title}
              </h4>
              <p className="mt-1 font-serif-body text-xs text-stone-700 dark:text-stone-300 leading-relaxed line-clamp-3">
                {entry.content}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-stone-200/50 dark:border-stone-800/60 pt-2">
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  {entry.category}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('diary')}
                  className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Open in Diary →
                </button>
              </div>
            </div>
          ))}
      </div>

      {pinnedNotes.length === 0 && (!pinnedDiary.length || (filterTarget !== 'all' && filterTarget !== 'diary' && filterTarget !== 'overview')) && (
        <div className="mt-4 rounded-2xl border border-dashed border-amber-200 p-6 text-center text-stone-500 dark:border-amber-900/50">
          <Pin className="h-5 w-5 mx-auto mb-1 text-amber-500" />
          <p className="text-xs font-serif-body">No pinned notes for this section yet. Click &quot;Attach New Pin&quot; above to add your first note or rule!</p>
        </div>
      )}
    </div>
  );
};
