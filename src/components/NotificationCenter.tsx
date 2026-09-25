import React, { useState, useRef, useEffect } from 'react';
import { useKairos } from '../context/KairosContext';
import { requestBrowserNotificationPermission } from '../utils/audio';
import {
  Bell,
  CheckCheck,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  Laptop,
  Sparkles,
  Calendar,
  X,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationCenter: React.FC = () => {
  const {
    state,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    updateNotificationSettings,
    testMilestoneNotification,
    unreadNotificationCount,
    setActiveTab,
    triggerCelebrationForMilestone,
    notificationSettings,
  } = useKairos();

  const isSoundEnabled = notificationSettings?.enableSound ?? true;
  const isBrowserPushEnabled = notificationSettings?.enableBrowserPush ?? false;

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleBrowserPush = async () => {
    if (!isBrowserPushEnabled) {
      const granted = await requestBrowserNotificationPermission();
      if (granted) {
        updateNotificationSettings({ enableBrowserPush: true });
      } else {
        alert('Browser notification permission was not granted or is blocked by your browser settings.');
      }
    } else {
      updateNotificationSettings({ enableBrowserPush: false });
    }
  };

  const handleNotificationClick = (notif: typeof state.notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.type === 'milestone' && notif.data?.milestoneAmount) {
      triggerCelebrationForMilestone(notif.data.milestoneAmount);
    }
    if (notif.data?.actionTab) {
      setActiveTab(notif.data.actionTab as any);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer shadow-2xs"
        aria-label="Open notifications"
        title="Portfolio alerts & milestone notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden text-stone-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <Bell className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold text-stone-900">
                  Notifications & Alerts
                </span>
                {unreadNotificationCount > 0 && (
                  <span className="rounded-full bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {unreadNotificationCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {state.notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="rounded p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  title="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Preferences Bar */}
            <div className="grid grid-cols-2 gap-1 border-b border-stone-100 bg-stone-50/40 p-2 text-[11px]">
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    enableSound: !isSoundEnabled,
                  })
                }
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 font-medium transition-colors ${
                  isSoundEnabled
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="Toggle Web Audio celebration chime"
              >
                {isSoundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-stone-400" />
                )}
                <span>Sound Chime: {isSoundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBrowserPush}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 font-medium transition-colors ${
                  isBrowserPushEnabled
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="Toggle desktop browser notifications"
              >
                <Laptop className="h-3.5 w-3.5 text-indigo-600" />
                <span>
                  Desktop Alert: {isBrowserPushEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Test 5M Notification Button */}
            <div className="border-b border-stone-100 bg-emerald-50/50 p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-950">
                <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                <span>5M Milestone Alert Simulator</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  testMilestoneNotification(5_000_000);
                  setIsOpen(false);
                }}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 shadow-2xs transition-colors"
                title="Trigger and test the 5M notification flow now"
              >
                <Play className="h-3 w-3" />
                Test 5M Alert
              </button>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
              {state.notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 space-y-1">
                  <Bell className="h-6 w-6 mx-auto text-stone-300" />
                  <p>No notifications yet</p>
                  <p className="text-[11px] text-stone-400">
                    Milestones and deposits will trigger alerts here.
                  </p>
                </div>
              ) : (
                state.notifications.map((notif) => {
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex items-start gap-3 p-3 transition-colors cursor-pointer text-left ${
                        !notif.read ? 'bg-emerald-50/30 font-medium' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                          notif.type === 'milestone'
                            ? 'bg-amber-100 text-amber-800'
                            : notif.type === 'savings'
                            ? 'bg-indigo-100 text-indigo-800'
                            : notif.type === 'dividend'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {notif.type === 'milestone' ? (
                          <Trophy className="h-4 w-4" />
                        ) : notif.type === 'savings' ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-tight">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 pt-0.5">
                          <Calendar className="h-2.5 w-2.5" />
                          <span>
                            {new Date(notif.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {state.notifications.length > 0 && (
              <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50 px-3 py-2 text-[11px]">
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="flex items-center gap-1 text-stone-500 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear history</span>
                </button>
                <span className="text-[10px] text-stone-400">
                  {state.notifications.length} stored
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
