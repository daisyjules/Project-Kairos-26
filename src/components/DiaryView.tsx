import React, { useState } from 'react';
import { useKairos } from '../context/KairosContext';
import { DiaryEntry } from '../types';
import {
  BookOpen,
  Plus,
  Calendar,
  Trash2,
  Edit3,
  Quote,
  Pin,
  MessageSquare,
} from 'lucide-react';
import { CommentsSection } from './CommentsSection';
import { EditableText } from './EditableText';

export const DiaryView: React.FC = () => {
  const {
    state,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    togglePinDiaryEntry,
    setActiveTab,
  } = useKairos();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isWritingNew, setIsWritingNew] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeCommentEntryId, setActiveCommentEntryId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DiaryEntry['category']>('Reflection');
  const [mood, setMood] = useState<DiaryEntry['mood']>('🌱 Calm');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');

  const categories: DiaryEntry['category'][] = [
    'Reflection',
    'Klin Fitz',
    'Zanzibar',
    'Poultry',
    'Wealth',
    'Personal',
  ];

  const moods: DiaryEntry['mood'][] = [
    '🌱 Calm',
    '✨ Inspired',
    '🔥 Focused',
    '🛡️ Cautious',
    '🎉 Celebratory',
  ];

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      updateDiaryEntry(editingId, {
        title,
        category,
        mood,
        date,
        content,
      });
      setEditingId(null);
    } else {
      addDiaryEntry({
        title,
        category,
        mood,
        date,
        content,
        isPinned: false,
        comments: [],
      });
    }

    // Reset
    setTitle('');
    setContent('');
    setIsWritingNew(false);
  };

  const handleEditClick = (entry: DiaryEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setCategory(entry.category);
    setMood(entry.mood || '🌱 Calm');
    setDate(entry.date);
    setContent(entry.content);
    setIsWritingNew(true);
  };

  const filteredEntries = (state.diaryEntries || []).filter(
    (e) => filterCategory === 'All' || e.category === filterCategory
  );

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Founder&apos;s diary</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">Think clearly. Build patiently.</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">A private record of decisions, lessons, and the work behind Project Kairos.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingId(null); setTitle(''); setContent(''); setIsWritingNew(true); }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1E3A2F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2C4A3E]"
        >
          <Plus className="h-4 w-4" />
          New entry
        </button>
      </header>

      <section className="rounded-xl border border-stone-200 bg-[#FDFBF7] p-5 sm:p-6" aria-labelledby="founders-insight-title">
        <div className="flex items-start gap-3">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A2F]" />
          <div>
            <p id="founders-insight-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Founder&apos;s insight</p>
            <blockquote className="mt-2 max-w-3xl text-base leading-relaxed text-stone-800 sm:text-lg">“We did not take the 30M loan to feel busy. We took it to buy real assets that generate cash while we live peacefully.”</blockquote>
            <p className="mt-3 text-xs text-stone-500">A reminder to prioritize durable cash flow over visible activity.</p>
          </div>
        </div>
      </section>

      {/* New Entry / Edit Form */}
      {isWritingNew && (
        <div className="rounded-3xl border border-emerald-600/40 bg-white p-6 sm:p-8 dark:border-emerald-600/40 dark:bg-stone-900 shadow-md transition-all">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#1E3A2F] dark:text-emerald-400" />
              <h2 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                {editingId ? 'Edit Diary Entry' : 'New Journal Entry'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsWritingNew(false)}
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Entry Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mom's first poultry feed batch delivered..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Venture / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DiaryEntry['category'])}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Mood / Mindset
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as DiaryEntry['mood'])}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {moods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Your Thoughts & Personal Notes
              </label>
              <textarea
                rows={5}
                required
                placeholder="Write freely... How are things going? What did you learn? What is the feeling today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 font-serif-body leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWritingNew(false)}
                className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#1E3A2F] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2C4A3E] transition-all cursor-pointer shadow-xs"
              >
                {editingId ? 'Update Entry' : 'Save to Diary'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#1E3A2F] text-white shadow-xs dark:bg-emerald-800'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-serif-body text-stone-500 dark:text-stone-400">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'reflection' : 'reflections'} recorded
        </span>
      </div>

      {/* 5. Journal Entries Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEntries.map((entry) => {
          const isCommentsOpen = activeCommentEntryId === entry.id;
          const commentsCount = (entry.comments || []).length;

          return (
            <div
              key={entry.id}
              className={`group rounded-3xl border p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                entry.isPinned
                  ? 'border-amber-300 bg-[#FFFDF8] dark:border-amber-800 dark:bg-[#1B1916]'
                  : 'border-stone-200/90 bg-white dark:border-stone-800/80 dark:bg-stone-900 hover:border-[#1E3A2F]/40 dark:hover:border-emerald-600/40'
              }`}
            >
              <div>
                {/* Header: Date + Mood + Category + Pin Button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      {entry.category}
                    </span>
                    {entry.mood && (
                      <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                        {entry.mood}
                      </span>
                    )}
                    {entry.isPinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <Pin className="h-2.5 w-2.5 fill-amber-500" />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-medium text-stone-400 dark:text-stone-500">
                    <button
                      type="button"
                      onClick={() => togglePinDiaryEntry(entry.id)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        entry.isPinned
                          ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/80'
                          : 'text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                      title={entry.isPinned ? 'Unpin reflection' : 'Pin reflection to top & corkboard'}
                    >
                      <Pin className={`h-3.5 w-3.5 ${entry.isPinned ? 'fill-amber-500' : ''}`} />
                    </button>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>

                {/* Title (Editable in-place) */}
                <EditableText
                  value={entry.title}
                  onSave={(newTitle) => updateDiaryEntry(entry.id, { title: newTitle })}
                  className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 block"
                />

                {/* Content (Editable in-place) */}
                <div className="mt-2.5">
                  <EditableText
                    value={entry.content}
                    multiline
                    onSave={(newContent) => updateDiaryEntry(entry.id, { content: newContent })}
                    className="font-serif-body text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line block"
                  />
                </div>
              </div>

              {/* Bottom Actions & Comments Thread */}
              <div className="mt-5 border-t border-stone-100 dark:border-stone-800/80 pt-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveCommentEntryId(isCommentsOpen ? null : entry.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>
                      {commentsCount > 0 ? `${commentsCount} comment${commentsCount > 1 ? 's' : ''}` : 'Add comment'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEditClick(entry)}
                      className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                      title="Edit entry full modal"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this diary entry?')) {
                          deleteDiaryEntry(entry.id);
                        }
                      }}
                      className="rounded-lg p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable Comments Drawer for this entry */}
                {isCommentsOpen && (
                  <div className="mt-3">
                    <CommentsSection
                      targetId={entry.id}
                      title="Entry Notes & Comments"
                      subtitle="Add thoughts or feedback on this entry."
                      isDiaryEntry={true}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <BookOpen className="mx-auto h-8 w-8 text-stone-400 mb-2" />
          <p className="font-editorial text-lg font-bold text-stone-700 dark:text-stone-300">
            No diary entries in this category yet
          </p>
          <p className="text-xs font-serif-body text-stone-500 mt-1">
            Click &quot;Write New Diary Entry&quot; to record your thoughts and reflections.
          </p>
        </div>
      )}
    </div>
  );
};
