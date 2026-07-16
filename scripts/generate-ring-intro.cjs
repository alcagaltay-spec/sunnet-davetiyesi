const fs = require("fs");
const path = require("path");

const sampleRate = 44100;
const duration = 8;
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

// Bespoke 8-second luxury cue. A dark D foundation opens into a warm
// D-major colour as the rings meet, mirroring black marble turning to gold.
// The picture deliberately holds in silence first. The score enters at 1.28s,
// exactly when the first ring starts emerging from the dark.
addTone(1.28, 6.72, 73.42, 0.105, { attack: .38, release: 1.05, pan: -0.08 });
addTone(1.34, 6.66, 110, 0.066, { attack: .42, release: 1.0, pan: 0.1 });
addTone(1.44, 3.1, 146.83, 0.058, { attack: .5, release: 1.0, pan: -0.28, shimmer: 0.08 });
addTone(1.62, 2.9, 174.61, 0.042, { attack: .55, release: 1.0, pan: 0.3, shimmer: 0.06 });

// First and second ring travel across the stereo field.
addBell(1.3, 587.33, 0.068, -0.62);
addBell(1.94, 698.46, 0.057, 0.6);
addBell(2.58, 880, 0.044, -0.35);
addBell(3.14, 1046.5, 0.04, 0.34);

// A restrained orchestral lift carries the typography into view.
addTone(2.65, 4.7, 220, 0.043, { attack: 1.2, release: 1.15, pan: -0.18, shimmer: 0.16 });
addTone(3.0, 4.35, 261.63, 0.036, { attack: 1.15, release: 1.1, pan: 0.2, shimmer: 0.13 });
addRise(2.45, 1.78, 0.105);

// Golden union at 4.16s: low cinematic body plus crystal highlights.
addImpact(4.16, 0.19);
addBell(4.16, 1174.66, 0.092, -0.08);
addBell(4.31, 1479.98, 0.052, 0.38);
addBell(4.53, 1760, 0.027, -0.4);
addTone(4.12, 3.6, 293.66, 0.052, { attack: 0.1, release: 1.0, pan: -0.22, shimmer: 0.2 });
addTone(4.12, 3.6, 369.99, 0.045, { attack: 0.12, release: 1.0, pan: 0.22, shimmer: 0.18 });
addTone(4.2, 3.45, 440, 0.029, { attack: 0.18, release: 1.05, pan: 0, shimmer: 0.22 });

// Door-light transition: one final breath, never a harsh trailer hit.
addRise(5.62, 1.82, 0.115);
addImpact(7.08, 0.11);
addBell(7.02, 880, 0.04, 0);

// Gentle stereo ambience and final fade.
let seed = 1234567;
for (let i = 0; i < frames; i += 1) {
  const t = i / sampleRate;
  seed = (seed * 16807) % 2147483647;
  const noise = seed / 1073741823.5 - 1;
  const fadeIn = smooth(1.28, 1.55, t);
  const fadeOut = 1 - smooth(7.18, 8, t);
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

const output = path.join(__dirname, "..", "public", "music", "luxury-marble-intro-8s.wav");
fs.writeFileSync(output, buffer);
console.log(`Created ${output} (${duration}s, stereo, ${sampleRate}Hz)`);
