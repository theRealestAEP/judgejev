import { useCallback, useEffect, useRef, useState } from 'react';

const CROSSFADE_SECONDS = 4;
type CourtAudio = {
  context: AudioContext;
  output: GainNode;
  gavel: AudioBuffer | null;
  stamp: AudioBuffer | null;
};

export function useCourtAudio() {
  const player = useRef<CourtAudio | null>(null);
  const muted = useRef(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const startAudio = useCallback(() => {
    if (!player.current) {
      const context = new AudioContext();
      const output = context.createGain();
      output.gain.value = muted.current ? 0 : 1;
      output.connect(context.destination);
      const current: CourtAudio = { context, output, gavel: null, stamp: null };
      player.current = current;

      async function load(path: string) {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Audio could not be loaded.');
        return context.decodeAudioData(await response.arrayBuffer());
      }

      void load('/audio/gavel-double.mp3')
        .then((buffer) => {
          current.gavel = buffer;
        })
        .catch(() => {});
      void load('/audio/verdict-stamp.mp3')
        .then((buffer) => {
          current.stamp = buffer;
        })
        .catch(() => {});
      void load('/audio/theremin-version.mp3')
        .then((track) => {
          if (context.state === 'closed') return;
          // Blend the track's tail into its beginning for a continuous loop.
          const fade = Math.round(CROSSFADE_SECONDS * track.sampleRate);
          const middle = track.length - 2 * fade;
          const loop = context.createBuffer(
            track.numberOfChannels,
            track.length - fade,
            track.sampleRate,
          );
          for (let channel = 0; channel < track.numberOfChannels; channel++) {
            const input = track.getChannelData(channel);
            const audio = loop.getChannelData(channel);
            audio.set(input.subarray(fade, track.length - fade));
            for (let i = 0; i < fade; i++) {
              const mix = i / (fade - 1);
              audio[middle + i] =
                input[track.length - fade + i] * (1 - mix) + input[i] * mix;
            }
          }
          const source = context.createBufferSource();
          source.buffer = loop;
          source.loop = true;
          const volume = context.createGain();
          volume.gain.value = 0.25;
          source.connect(volume).connect(output);
          source.start();
        })
        .catch(() => {});
    }
    const current = player.current;
    // Resume within the Play or Unmute gesture, before waiting for downloads.
    void current.context
      .resume()
      .then(() => {
        if (current.context.state !== 'closed') setAudioPlaying(!muted.current);
      })
      .catch(() => {});
  }, []);

  const playSound = useCallback((sound: 'gavel' | 'stamp') => {
    const current = player.current;
    if (!current || muted.current || current.context.state !== 'running')
      return;
    const buffer = current[sound];
    if (!buffer) return;
    const source = current.context.createBufferSource();
    source.buffer = buffer;
    source.connect(current.output);
    source.start();
  }, []);

  function toggleAudio() {
    muted.current = !muted.current;
    const current = player.current;
    if (current) {
      // Keep the clock running while muted so old effects never play on unmute.
      current.output.gain.setTargetAtTime(
        muted.current ? 0 : 1,
        current.context.currentTime,
        0.015,
      );
      setAudioPlaying(!muted.current);
    }
    if (!muted.current) startAudio();
  }

  useEffect(
    () => () => {
      const current = player.current;
      player.current = null;
      if (current && current.context.state !== 'closed')
        void current.context.close();
    },
    [],
  );

  return { startAudio, toggleAudio, audioPlaying, playSound };
}
