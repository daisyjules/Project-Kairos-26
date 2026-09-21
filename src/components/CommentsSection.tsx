import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Send, Heart, Sparkles, User } from 'lucide-react';
import { useKairos } from '../context/KairosContext';
import { CommentItem } from '../types';

interface CommentsSectionProps {
  targetId: string; // e.g. 'overview' | 'klinfitz' | 'zanzibar' | 'poultry' | 'utt' | 'entry-1'
  title?: string;
  subtitle?: string;
  isDiaryEntry?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  targetId,
  title = 'Thoughts & Comments',
  subtitle = 'Leave operational notes, feedback from Mom or Alice, or personal reflections.',
  isDiaryEntry = false,
}) => {
  const { state, addGeneralComment, deleteGeneralComment, addCommentToDiaryEntry, deleteCommentFromDiaryEntry } =
    useKairos();
  const [author, setAuthor] = useState('Me');
  const [content, setContent] = useState('');
  const [pinColor, setPinColor] = useState<'gold' | 'emerald' | 'coral' | 'indigo'>('gold');
  const [isExpanded, setIsExpanded] = useState(false);

  // Retrieve comments
  let comments: CommentItem[] = [];
  if (isDiaryEntry) {
    const entry = (state.diaryEntries || []).find((e) => e.id === targetId);
    comments = entry?.comments || [];
  } else {
    comments = (state.comments || []).filter((c) => c.targetId === targetId);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (isDiaryEntry) {
      addCommentToDiaryEntry(targetId, {
        author: author.trim() || 'Me',
        content: content.trim(),
        pinColor,
      });
    } else {
      addGeneralComment({
        targetId,
        author: author.trim() || 'Me',
        content: content.trim(),
        pinColor,
      });
    }

    setContent('');
  };

  const handleDelete = (commentId: string) => {
    if (isDiaryEntry) {
      deleteCommentFromDiaryEntry(targetId, commentId);
    } else {
      deleteGeneralComment(commentId);
    }
  };

  return (
    <div className="rounded-3xl border border-stone-200/90 bg-white p-6 dark:border-stone-800/80 dark:bg-stone-900/90 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3.5 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{title}</span>
              <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-mono-num font-semibold text-stone-600 dark:text-stone-400">
                {comments.length}
              </span>
            </h4>
            {subtitle && (
              <p className="font-serif-body text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 hover:underline cursor-pointer"
        >
          {isExpanded ? 'Hide comments' : comments.length > 0 ? `View ${comments.length} comment${comments.length > 1 ? 's' : ''}` : '+ Add comment'}
        </button>
      </div>

      {/* List of comments */}
      {(isExpanded || comments.length > 0) && (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => {
            const pinClass =
              comment.pinColor === 'emerald'
                ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                : comment.pinColor === 'coral'
                ? 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/50'
                : comment.pinColor === 'indigo'
                ? 'border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 dark:border-sky-900/50'
                : 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50';

            return (
              <div
                key={comment.id}
                className={`group rounded-2xl border p-3.5 transition-all ${pinClass}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-[10px] font-bold">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-editorial text-xs font-bold text-stone-900 dark:text-stone-100">
                      {comment.author}
                    </span>
                    <span className="text-[10px] font-mono-num text-stone-400">
                      {comment.createdAt}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete comment"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                <p className="font-serif-body text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-8">
                  {comment.content}
                </p>
              </div>
            );
          })}

          {comments.length === 0 && (
            <p className="text-center text-xs font-serif-body text-stone-400 py-2">
              No comments added yet. Share a thought or partner feedback below.
            </p>
          )}

          {/* Add Comment Input Form */}
          <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-1.5 sm:w-36 shrink-0">
                <span className="text-[11px] text-stone-500 font-medium">As:</span>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-medium text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Me">Me</option>
                  <option value="Mom">Mom</option>
                  <option value="Alice">Alice</option>
                  <option value="Advisor">Advisor</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a comment or note..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 pr-10 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#1E3A2F] p-1.5 text-white hover:bg-emerald-800 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
