import confetti from 'canvas-confetti';

/**
 * Synthesizes a clean, pleasant ascending chord chime via Web Audio API.
 * Does not depend on external mp3 assets and works offline/cross-platform.
 */
export function playMilestoneChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Melodic ascending celebratory arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const chord = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      // Smooth attack and subtle decay
      gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.5);
    });
  } catch (err) {
    console.warn('Audio chime playback omitted or unsupported:', err);
  }
}

/**
 * Requests permission for desktop browser notifications.
 */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Dispatches a native browser desktop push notification if permission is granted.
 */
export function sendBrowserNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch (e) {
      console.warn('Browser notification send error:', e);
    }
  }
}

/**
 * Triggers a vibrant celebratory confetti burst.
 */
export function triggerCelebrationConfetti() {
  try {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#059669', '#10B981', '#34D399', '#FBBF24', '#3B82F6', '#6366F1'],
    });
  } catch {
    // Graceful fallback if canvas is unavailable
  }
}
