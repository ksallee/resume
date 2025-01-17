<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  const { gameActive, showingMenu, musicEnabled, sfxEnabled } = $props();
  const dispatch = createEventDispatcher();

  let audioContext = null;
  let sounds = $state({});
  let gameMusic = null;
  let mainGainNode = null;
  let musicGainNode = null;
  let sfxGainNode = null;
  let currentlyPlaying = false;

  // Initialize Audio Context on first user interaction
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create main gain node
      mainGainNode = audioContext.createGain();
      mainGainNode.connect(audioContext.destination);

      // Create music gain node
      musicGainNode = audioContext.createGain();
      musicGainNode.connect(mainGainNode);
      musicGainNode.gain.value = 0.3; // Music at 30% volume

      // Create SFX gain node
      sfxGainNode = audioContext.createGain();
      sfxGainNode.connect(mainGainNode);
      sfxGainNode.gain.value = 1.0; // SFX at 100% volume
    }
    return audioContext;
  }

  onMount(async () => {
    // Load sounds
    const soundFiles = {
      explosion: '/explosion.mp3',
      laser: '/laser_shooting.mp3',
      collision: '/ship_collision.mp3',
      wrong: '/wrong_answer.mp3',
      gameOver: '/game_over.mp3'
    };

    try {
      initAudioContext();

      const loadSound = async (name, url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return new Promise((resolve, reject) => {
          audioContext.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              sounds[name] = buffer;
              resolve();
            },
            (error) => reject(error)
          );
        });
      };

      await Promise.all(
        Object.entries(soundFiles).map(([name, url]) => loadSound(name, url))
      );

      // Load music
      const musicResponse = await fetch('/game_music.mp3');
      const musicBuffer = await musicResponse.arrayBuffer();

      const musicAudioBuffer = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(
          musicBuffer,
          (buffer) => resolve(buffer),
          (error) => reject(error)
        );
      });

      gameMusic = audioContext.createBufferSource();
      gameMusic.buffer = musicAudioBuffer;
      gameMusic.loop = true;
      gameMusic.connect(musicGainNode); // Connect to music gain node

      // Start music if appropriate
      if (showingMenu && musicEnabled) {
        startMusic();
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  });

  function startMusic() {
    if (!gameMusic || currentlyPlaying) return;

    try {
      initAudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      gameMusic.start(0);
      currentlyPlaying = true;
    } catch (error) {
      console.error('Error starting music:', error);
      recreateMusicSource();
    }
  }

  function stopMusic() {
    if (!gameMusic || !currentlyPlaying) return;

    try {
      gameMusic.stop();
      currentlyPlaying = false;
      recreateMusicSource();
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  }

  function recreateMusicSource() {
    if (!gameMusic?.buffer) return;

    const oldBuffer = gameMusic.buffer;
    gameMusic = audioContext.createBufferSource();
    gameMusic.buffer = oldBuffer;
    gameMusic.loop = true;
    gameMusic.connect(musicGainNode); // Connect to music gain node
  }

  // Export playSound function
  const playSound = (name) => {
    if (!sfxEnabled || !sounds[name]) return;

    try {
      initAudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = sounds[name];
      source.connect(sfxGainNode); // Connect to SFX gain node
      source.start(0);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Watch musicEnabled changes
  $effect(() => {
    if (musicEnabled && (showingMenu || gameActive)) {
      startMusic();
    } else {
      stopMusic();
    }
  });

  onDestroy(() => {
    stopMusic();
    if (audioContext) {
      audioContext.close();
    }
  });

  // Expose methods to parent
  $effect(() => {
    dispatch('playSound', playSound);
  });
</script>