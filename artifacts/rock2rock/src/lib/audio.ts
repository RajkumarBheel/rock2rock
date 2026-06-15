let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicOscillators: OscillatorNode[] = [];
let musicPlaying = false;
let soundEnabled = true;
let musicEnabled = true;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

async function ensureRunning(): Promise<boolean> {
  const c = getCtx();
  if (c.state === "suspended") {
    try { await c.resume(); } catch (_) { return false; }
  }
  return c.state === "running";
}

export function setSoundEnabled(v: boolean) { soundEnabled = v; }
export function setMusicEnabled(v: boolean) {
  musicEnabled = v;
  if (!v) stopMusic();
  else if (!musicPlaying) startAmbientMusic();
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  startDelay = 0,
  freqEnd?: number,
) {
  if (!soundEnabled) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + startDelay);
  if (freqEnd !== undefined) {
    osc.frequency.linearRampToValueAtTime(freqEnd, c.currentTime + startDelay + duration);
  }
  gain.gain.setValueAtTime(0, c.currentTime + startDelay);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + startDelay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startDelay + duration);
  osc.start(c.currentTime + startDelay);
  osc.stop(c.currentTime + startDelay + duration);
}

export function playClick() {
  playTone(600, 0.08, "square", 0.12);
}

export function playHover() {
  playTone(900, 0.05, "sine", 0.06);
}

export function playRock() {
  if (!soundEnabled) return;
  const c = getCtx();
  const bufSize = c.sampleRate * 0.25;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.5, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
  src.connect(gain);
  gain.connect(c.destination);
  src.start();
  playTone(80, 0.2, "sine", 0.4, 0, 40);
}

export function playPaper() {
  if (!soundEnabled) return;
  const c = getCtx();
  const bufSize = c.sampleRate * 0.18;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 1.5) * 0.5;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.35, c.currentTime);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start();
}

export function playScissors() {
  playTone(1200, 0.04, "sawtooth", 0.18, 0, 400);
  playTone(900, 0.04, "sawtooth", 0.14, 0.05, 200);
}

export function playRoundWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => playTone(f, 0.15, "triangle", 0.25, i * 0.1));
}

export function playRoundLoss() {
  playTone(440, 0.2, "sine", 0.25, 0);
  playTone(330, 0.25, "sine", 0.2, 0.18);
  playTone(220, 0.35, "sine", 0.2, 0.38);
}

export function playTie() {
  playTone(700, 0.12, "sine", 0.2);
  playTone(700, 0.12, "sine", 0.15, 0.15);
}

export function playVictory() {
  const melody = [523, 659, 784, 659, 1047];
  melody.forEach((f, i) => playTone(f, 0.25, "triangle", 0.3, i * 0.18));
  const bass = [261, 330, 392, 523];
  bass.forEach((f, i) => playTone(f, 0.3, "sine", 0.2, i * 0.18));
}

export function playDefeat() {
  const melody = [440, 370, 311, 262];
  melody.forEach((f, i) => playTone(f, 0.3, "sine", 0.25, i * 0.2));
}

export function playBlocked() {
  playTone(200, 0.08, "square", 0.2);
  playTone(180, 0.12, "square", 0.2, 0.1);
}

export function playCountdown(num: number) {
  if (num === 0) {
    playTone(880, 0.2, "triangle", 0.35);
  } else {
    playTone(660, 0.1, "triangle", 0.2);
  }
}

function buildMusicLoop() {
  if (!musicEnabled || !musicGain) return;
  const c = getCtx();
  const chords = [
    [110, 138, 165],
    [116, 146, 174],
    [98, 123, 147],
    [104, 131, 156],
  ];
  let step = 0;
  const chordDuration = 3;

  const scheduleChord = () => {
    if (!musicEnabled || !musicGain) return;
    const chord = chords[step % chords.length];
    chord.forEach((freq) => {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, c.currentTime);
      const oscGain = c.createGain();
      oscGain.gain.setValueAtTime(0, c.currentTime);
      oscGain.gain.linearRampToValueAtTime(1, c.currentTime + 0.5);
      oscGain.gain.setValueAtTime(1, c.currentTime + chordDuration - 0.5);
      oscGain.gain.linearRampToValueAtTime(0, c.currentTime + chordDuration);
      osc.connect(oscGain);
      oscGain.connect(musicGain!);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + chordDuration);
      musicOscillators.push(osc);
    });
    step++;
  };

  scheduleChord();
  const interval = setInterval(() => {
    if (!musicEnabled) { clearInterval(interval); return; }
    scheduleChord();
  }, chordDuration * 1000 - 200);

  musicPlaying = true;
  (window as any).__musicInterval = interval;
}

export async function startAmbientMusic() {
  if (musicPlaying || !musicEnabled) return;
  const ready = await ensureRunning();
  if (!ready) return;
  const c = getCtx();
  musicGain = c.createGain();
  musicGain.gain.setValueAtTime(0.06, c.currentTime);
  musicGain.connect(c.destination);
  buildMusicLoop();
}

export function stopMusic() {
  musicPlaying = false;
  musicOscillators.forEach((o) => { try { o.stop(); } catch (_) {} });
  musicOscillators = [];
  if ((window as any).__musicInterval) {
    clearInterval((window as any).__musicInterval);
    (window as any).__musicInterval = null;
  }
  if (musicGain) {
    try {
      const c = getCtx();
      musicGain.gain.setValueAtTime(musicGain.gain.value, c.currentTime);
      musicGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
    } catch (_) {}
    musicGain = null;
  }
}
