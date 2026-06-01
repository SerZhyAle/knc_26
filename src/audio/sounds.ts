export function playStompSound(): void {
  try {
    const ContextClass = window.AudioContext || (window as unknown as Record<string, unknown>)["webkitAudioContext"];
    if (!ContextClass) return;
    const audioContext = new (ContextClass as typeof AudioContext)();
    const now = audioContext.currentTime;

    for (let i = 0; i < 2; i++) {
      const startTime = now + i * 0.1;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(150, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, startTime + 0.07);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.07);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.07);
    }
  } catch {
    // Silently fail if audio context unavailable
  }
}
