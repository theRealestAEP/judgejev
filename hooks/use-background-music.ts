import { useCallback, useEffect, useRef, useState } from 'react';

const CROSSFADE_SECONDS = 4;

export function useBackgroundMusic() {
  const player = useRef<{ context: AudioContext; ready: Promise<void> } | null>(
    null,
  );
  const muted = useRef(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const startMusic = useCallback(() => {
    if (muted.current) return;
    if (!player.current) {
      const context = new AudioContext();
      const ready = (async () => {
        const response = await fetch('/audio/theremin-version.mp3');
        if (!response.ok) throw new Error('Music could not be loaded.');
        const track = await context.decodeAudioData(
          await response.arrayBuffer(),
        );
        if (context.state === 'closed') return;

        // Overlap the last four seconds with the first four, then put that
        // blend after the middle of the track. The resulting buffer loops
        // continuously on the audio clock, including in background tabs.
        const fade = Math.round(CROSSFADE_SECONDS * track.sampleRate);
        const middle = track.length - 2 * fade;
        const loop = context.createBuffer(
          track.numberOfChannels,
          track.length - fade,
          track.sampleRate,
        );
        for (let channel = 0; channel < track.numberOfChannels; channel++) {
          const input = track.getChannelData(channel);
          const output = loop.getChannelData(channel);
          output.set(input.subarray(fade, track.length - fade));
          for (let i = 0; i < fade; i++) {
            const mix = i / (fade - 1);
            output[middle + i] =
              input[track.length - fade + i] * (1 - mix) + input[i] * mix;
          }
        }
        const source = context.createBufferSource();
        source.buffer = loop;
        source.loop = true;
        const volume = context.createGain();
        volume.gain.value = 0.25;
        source.connect(volume).connect(context.destination);
        source.start();
      })();
      player.current = { context, ready };
    }
    const current = player.current;
    // Resume immediately from the click; the download may finish afterward.
    void Promise.all([current.context.resume(), current.ready])
      .then(() => {
        if (current.context.state !== 'closed')
          setMusicPlaying(
            !muted.current && current.context.state === 'running',
          );
      })
      .catch(() => {
        if (current.context.state === 'closed') return;
        void current.context.close();
        if (player.current === current) player.current = null;
        setMusicPlaying(false);
      });
  }, []);

  function toggleMusic() {
    const current = player.current;
    if (current && current.context.state === 'running') {
      muted.current = true;
      void current.context.suspend().then(() => setMusicPlaying(false));
    } else {
      muted.current = false;
      startMusic();
    }
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

  return { startMusic, toggleMusic, musicPlaying };
}
