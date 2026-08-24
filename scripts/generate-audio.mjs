// Script to generate a valid audio file (gentle music box melody loop)
import { writeFileSync } from 'fs';

function generateWavFile(filename) {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const duration = 8; // 8 seconds loop
  const totalSamples = sampleRate * duration;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Music Box Melody notes (frequencies in Hz): "Phoolon ka taron ka" lullaby theme
  // C5=523.25, D5=587.33, E5=659.25, F5=698.46, G5=783.99, A5=880.00
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.5 },
    { freq: 659.25, time: 0.5, dur: 0.5 },
    { freq: 783.99, time: 1.0, dur: 0.75 },
    { freq: 659.25, time: 1.75, dur: 0.5 },
    { freq: 783.99, time: 2.25, dur: 0.75 },
    { freq: 880.00, time: 3.0, dur: 0.5 },
    { freq: 783.99, time: 3.5, dur: 0.5 },
    { freq: 659.25, time: 4.0, dur: 0.75 },
    { freq: 587.33, time: 4.75, dur: 0.5 },
    { freq: 659.25, time: 5.25, dur: 0.75 },
    { freq: 523.25, time: 6.0, dur: 1.5 },
  ];

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sampleVal = 0;

    for (const note of notes) {
      if (t >= note.time && t < note.time + note.dur) {
        const noteT = t - note.time;
        const env = Math.exp(-noteT * 3); // Bell-like music box decay
        const wave = Math.sin(2 * Math.PI * note.freq * noteT) * env;
        sampleVal += wave * 0.25;
      }
    }

    const pcmVal = Math.max(-32768, Math.min(32767, Math.round(sampleVal * 32767)));

    // Left channel
    buffer.writeInt16LE(pcmVal, offset);
    // Right channel
    buffer.writeInt16LE(pcmVal, offset + 2);
    offset += 4;
  }

  writeFileSync(filename, buffer);
  console.log(`🎵 Generated valid audio track: ${filename}`);
}

generateWavFile('./public/assets/audio/bg-music.mp3');
