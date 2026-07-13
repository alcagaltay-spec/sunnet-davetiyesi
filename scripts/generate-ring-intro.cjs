const fs = require("fs");
const path = require("path");

const sampleRate = 44100;
const duration = 7;
const frames = sampleRate * duration;
const left = new Float64Array(frames);
const right = new Float64Array(frames);
const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function addTone(start, length, frequency, gain, options = {}) {
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, Math.floor((start + length) * sampleRate));
  const attack = options.attack ?? 0.08;
  const release = options.release ?? 0.35;
  const pan = options.pan ?? 0;
  const shimmer = options.shimmer ?? 0;

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    const local = t / length;
    const envelope = smooth(0, attack / length, local) * (1 - smooth(1 - release / length, 1, local));
    const drift = 1 + 0.0018 * Math.sin(TAU * 0.23 * t);
    const phase = TAU * frequency * drift * t;
    const fundamental = Math.sin(phase);
    const harmonic = 0.32 * Math.sin(phase * 2 + 0.4) + 0.13 * Math.sin(phase * 3 + 1.1);
    const sparkle = shimmer * Math.sin(phase * 4.01 + Math.sin(t * 2.7));
    const value = (fundamental + harmonic + sparkle) * gain * envelope;
    left[i] += value * Math.sqrt((1 - pan) / 2);
    right[i] += value * Math.sqrt((1 + pan) / 2);
  }
}

function addBell(start, frequency, gain, pan) {
  const length = Math.min(2.5, duration - start);
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, Math.floor((start + length) * sampleRate));

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    const envelope = Math.exp(-2.4 * t) * smooth(0, 0.012, t);
    const value = gain * envelope * (
      Math.sin(TAU * frequency * t) +
      0.55 * Math.sin(TAU * frequency * 2.01 * t + 0.3) +
      0.24 * Math.sin(TAU * frequency * 3.98 * t + 0.8)
    );
    left[i] += value * Math.sqrt((1 - pan) / 2);
    right[i] += value * Math.sqrt((1 + pan) / 2);
  }
}

function addImpact(start, gain) {
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, begin + Math.floor(1.5 * sampleRate));
  let seed = 918273;

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    seed = (seed * 16807) % 2147483647;
    const noise = seed / 1073741823.5 - 1;
    const body = Math.sin(TAU * (62 - 19 * t) * t) * Math.exp(-4.2 * t);
    const air = noise * Math.exp(-8 * t) * 0.22;
    const value = gain * (body + air);
    left[i] += value * 0.72;
    right[i] += value * 0.72;
  }
}

function addRise(start, length, gain) {
  const begin = Math.floor(start * sampleRate);
  const end = Math.min(frames, Math.floor((start + length) * sampleRate));
  let seed = 456789;

  for (let i = begin; i < end; i += 1) {
    const t = (i - begin) / sampleRate;
    const p = t / length;
    seed = (seed * 48271) % 2147483647;
    const noise = seed / 1073741823.5 - 1;
    const shimmer = Math.sin(TAU * (280 + 900 * p * p) * t);
    const envelope = smooth(0, 1, p) * (1 - smooth(0.91, 1, p));
    const value = gain * envelope * (noise * 0.32 + shimmer * 0.18);
    left[i] += value * (0.65 + 0.2 * Math.sin(t * 2.1));
    right[i] += value * (0.65 - 0.2 * Math.sin(t * 2.1));
  }
}

// Warm D-major luxury bed: D2, A2, D3, F#3, A3.
addTone(0, 7, 73.42, 0.11, { attack: 1.3, release: 0.8, pan: -0.1 });
addTone(0.15, 6.85, 110, 0.075, { attack: 1.1, release: 0.9, pan: 0.12 });
addTone(0.35, 6.65, 146.83, 0.07, { attack: 1.0, release: 0.8, pan: -0.25, shimmer: 0.12 });
addTone(1.05, 5.95, 185, 0.055, { attack: 1.2, release: 0.9, pan: 0.28, shimmer: 0.1 });
addTone(2.15, 4.85, 220, 0.045, { attack: 0.9, release: 0.9, pan: 0.05, shimmer: 0.18 });

// Ring arrivals and the union highlight.
addBell(0.65, 587.33, 0.095, -0.5);
addBell(1.55, 739.99, 0.085, 0.48);
addBell(2.65, 880, 0.07, -0.18);
addRise(2.55, 2.4, 0.13);
addImpact(4.22, 0.24);
addBell(4.2, 1174.66, 0.12, 0);
addBell(4.43, 1479.98, 0.065, 0.35);
addTone(4.2, 2.8, 293.66, 0.06, { attack: 0.06, release: 0.65, pan: -0.18, shimmer: 0.22 });
addTone(4.2, 2.8, 369.99, 0.052, { attack: 0.08, release: 0.65, pan: 0.2, shimmer: 0.2 });

// Gentle stereo ambience and final fade.
let seed = 1234567;
for (let i = 0; i < frames; i += 1) {
  const t = i / sampleRate;
  seed = (seed * 16807) % 2147483647;
  const noise = seed / 1073741823.5 - 1;
  const fadeIn = smooth(0, 0.45, t);
  const fadeOut = 1 - smooth(6.15, 7, t);
  const motion = 0.008 * noise * fadeIn * fadeOut;
  left[i] = (left[i] + motion) * fadeOut;
  right[i] = (right[i] - motion * 0.82) * fadeOut;
}

let peak = 0;
for (let i = 0; i < frames; i += 1) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const scale = 0.88 / Math.max(peak, 0.001);
const dataSize = frames * 2 * 2;
const buffer = Buffer.alloc(44 + dataSize);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

for (let i = 0; i < frames; i += 1) {
  buffer.writeInt16LE(Math.round(clamp(left[i] * scale, -1, 1) * 32767), 44 + i * 4);
  buffer.writeInt16LE(Math.round(clamp(right[i] * scale, -1, 1) * 32767), 46 + i * 4);
}

const output = path.join(__dirname, "..", "public", "music", "ring-intro-7s.wav");
fs.writeFileSync(output, buffer);
console.log(`Created ${output} (${duration}s, stereo, ${sampleRate}Hz)`);
