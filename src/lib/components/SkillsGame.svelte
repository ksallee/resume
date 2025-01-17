<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Spring, Tween } from 'svelte/motion';
	import AudioManager from './AudioManager.svelte';

	const { skills, skillElements } = $props();
	const MAX_LASERS = 3;
	const SKILL_SCALE_FACTOR = 1.3;
	const SCORE_VALUES = {
		easy: 1,
		medium: 5,
		hard: 10
	};

	const DIFFICULTY_SETTINGS = {
		typing: {
			easy: { spawnInterval: 3000, maxSkills: 4, skillSpeed: 0.3 },
			medium: { spawnInterval: 2000, maxSkills: 5, skillSpeed: 0.4 },
			hard: { spawnInterval: 1000, maxSkills: 5, skillSpeed: 0.6 }
		},
		classic: {
			easy: { spawnInterval: 1500, maxSkills: 8, skillSpeed: 0.8 },
			medium: { spawnInterval: 500, maxSkills: 10, skillSpeed: 1.0 },
			hard: { spawnInterval: 300, maxSkills: 15, skillSpeed: 1.2 }
		}
	};

	let gameActive = $state(false);
	let activeSkills = $state([]);
	let score = $state(0);
	let highScore = $state(0);
	let lives = $state(3);
	let gameLoop = $state(null);
	let aircraft = $state(null);
	let dialog = $state(null);
	let laserElements = $state([]);
	let particles = $state([]);
	let mounted = $state(false);
	let shipShaking = $state(false);
	let difficulty = $state(null);
	let showDifficultySelect = $state(false);
	let isGameOver = $state(false);
	let musicEnabled = $state(true);
	let sfxEnabled = $state(true);
	let gameMode = $state('classic');
	let activeLasers = $state([]);

	let innerHeight = $state(0)

	// New state variables for vertical movement
	let keysPressed = $state(new Set());
	let maxShipSpeed = 5;
	let shipTween = $state(new Tween(innerHeight / 2, {
		duration: 100,
		// easing: t => t // Linear easing for more responsive control
	}));

	let playSound = $state(() => {});
	let toggleMusic = $state((enabled) => {
		musicEnabled = enabled;
		localStorage.setItem('skillGameMusicEnabled', enabled);
	});
	let toggleSFX = $state((enabled) => {
		sfxEnabled = enabled;
		localStorage.setItem('skillGameSFXEnabled', enabled);
	});
	let soundPlayer = $state(null);

	let skillSpring = $state(new Spring(1, {
		stiffness: 0.1,
		damping: 0.6,
		precision: 0.01
	}));

	onMount(() => {
		mounted = true;
		const savedHighScore = localStorage.getItem('skillGameHighScore');
		if (savedHighScore) {
			highScore = parseInt(savedHighScore, 10);
		}
	});

	const normalizeSkill = (skill) => {
		return skill.replace(/\s+/g, '');
	};

	const getAllSkills = () => {
		const allSkills = [];
		for (const category in skills) {
			allSkills.push(...skills[category]);
		}
		return allSkills;
	};

	const getElementPosition = (element) => {
		if (!element) return null;
		const rect = element.getBoundingClientRect();
		return {
			x: rect.left + (rect.width / 2),
			y: rect.top + (rect.height / 2)
		};
	};

	const calculateAngle = (start, end) => {
		return Math.atan2(end.y - start.y, end.x - start.x);
	};

	const createParticles = (x, y) => {
		soundPlayer?.('explosion');
		const particleCount = 40;
		const newParticles = [];
		const baseId = Math.random();
		for (let i = 0; i < particleCount; i++) {
			const angle = (i * 360 / particleCount) * (Math.PI / 180);
			const randomSpeed = 1 + Math.random() * 4;
			newParticles.push({
				id: `${baseId}-${i}`,
				x,
				y,
				angle,
				speed: randomSpeed,
				life: 2
			});
		}
		particles = [...particles, ...newParticles];

		const animateParticles = () => {
			particles = particles
				.map(p => ({
					...p,
					x: p.x + Math.cos(p.angle) * p.speed,
					y: p.y + Math.sin(p.angle) * p.speed,
					life: p.life - 0.05
				}))
				.filter(p => p.life > 0);

			if (particles.length > 0) {
				requestAnimationFrame(animateParticles);
			}
		};
		requestAnimationFrame(animateParticles);
	};

	const shootClassicLaser = () => {
		if (activeLasers.length >= MAX_LASERS) return;

		soundPlayer?.('laser');
		const aircraftPos = getElementPosition(aircraft);
		if (!aircraftPos) return;

		const newLaser = {
			x: aircraftPos.x,
			y: aircraftPos.y,
			angle: 0, // Always shoot horizontally
			speed: 10,
			id: Date.now()
		};

		activeLasers = [...activeLasers, newLaser];

		const animateLaser = () => {
			if (!gameActive) return;

			activeLasers = activeLasers.map(laser => ({
				...laser,
				x: laser.x + Math.cos(laser.angle) * laser.speed,
				y: laser.y + Math.sin(laser.angle) * laser.speed
			})).filter(laser => {
				// Check for collisions with skills
				const hitSkills = new Set();
				activeSkills.forEach(skill => {
					const skillCenter = {
						x: skill.currentX + skill.width / 2,
						y: skill.currentY + skill.height / 2
					};

					const distance = Math.hypot(
						laser.x - skillCenter.x,
						laser.y - skillCenter.y
					);

					if (distance < 30) {
						hitSkills.add(skill.id);
						setTimeout(() => {
							createParticles(skillCenter.x, skillCenter.y);
							score += SCORE_VALUES[difficulty];
							if (score > highScore) {
								highScore = score;
								localStorage.setItem('skillGameHighScore', highScore.toString());
							}
						}, 0);
					}
				});

				activeSkills = activeSkills.filter(skill => !hitSkills.has(skill.id));

				// Remove laser if it hit something or is off screen
				const isOffScreen =
					laser.x < 0 ||
					laser.x > window.innerWidth ||
					laser.y < 0 ||
					laser.y > window.innerHeight;

				return !hitSkills.size && !isOffScreen;
			});

			if (activeLasers.length > 0) {
				requestAnimationFrame(animateLaser);
			}
		};

		requestAnimationFrame(animateLaser);
	};

	const shootLaser = (skill) => {
		soundPlayer?.('laser');
		const aircraftPos = getElementPosition(aircraft);
		if (!aircraftPos) return;

		const skillPos = {
			x: skill.currentX + skill.width / 2,
			y: skill.currentY + skill.height / 2
		};

		const angle = calculateAngle(aircraftPos, skillPos);

		const distance = Math.hypot(skillPos.x - aircraftPos.x, skillPos.y - aircraftPos.y);

		const laser = {
			startX: aircraftPos.x,
			startY: aircraftPos.y,
			endX: skillPos.x,
			endY: skillPos.y,
			angle,
			progress: 0,
			id: Date.now(),
			skillId: skill.id
		};

		laserElements = [...laserElements, laser];

		const startTime = performance.now();
		const duration = Math.min(200 + distance / 5, 400);

		activeSkills = activeSkills.map(s => {
			if (s.id === skill.id) {
				return { ...s, shake: true };
			}
			return s;
		});

		const animateLaser = (timestamp) => {
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			laserElements = laserElements.map(l => {
				if (l.id === laser.id) {
					return { ...l, progress };
				}
				return l;
			});

			if (progress < 1) {
				requestAnimationFrame(animateLaser);
			} else {
				setTimeout(() => {
					createParticles(skillPos.x, skillPos.y);
					laserElements = laserElements.filter(l => l.id !== laser.id);
					activeSkills = activeSkills.filter(s => s.id !== laser.skillId);
					score += SCORE_VALUES[difficulty];

					if (score > highScore) {
						highScore = score;
						localStorage.setItem('skillGameHighScore', highScore.toString());
					}
				}, 0);
			}
		};

		requestAnimationFrame(animateLaser);
	};

	const launchSkill = (skill, index) => {
		const element = skillElements[index];
		if (!element) return;

		const rect = element.getBoundingClientRect();
		const startPos = {
			x: rect.left,
			y: rect.top
		};

		const aircraftPos = getElementPosition(aircraft);
		if (!aircraftPos) return;

		const angle = calculateAngle(startPos, aircraftPos);
		const settings = DIFFICULTY_SETTINGS[gameMode][difficulty];
		const speed = settings.skillSpeed * (0.9 + Math.random() * 0.2);

		setTimeout(() => {
			skillSpring.target = SKILL_SCALE_FACTOR;
		}, 300);

		activeSkills = [...activeSkills, {
			text: skill,
			normalizedText: normalizeSkill(skill),
			startX: startPos.x,
			startY: startPos.y,
			currentX: startPos.x,
			currentY: startPos.y,
			width: rect.width,
			height: rect.height,
			angle,
			speed,
			matchedChars: 0,
			shake: false,
			id: Date.now()
		}];
	};

	const showGameOver = () => {
		isGameOver = true;
		gameActive = false;
		if (gameLoop) clearInterval(gameLoop);
		activeSkills = [];
		laserElements = [];
		particles = [];
		activeLasers = [];
		shipTween.set(window.innerHeight / 2);
		keysPressed.clear();
		skillSpring.target = 1;
	};

	const startGame = () => {
		if (!mounted) return;

		if (!difficulty) {
			showDifficultySelect = true;
			if (dialog?.close) dialog.close();
			return;
		}

		showDifficultySelect = false;
		if (dialog?.showModal) dialog.showModal();
		gameActive = true;
		isGameOver = false;
		score = 0;
		lives = 3;
		activeSkills = [];
		laserElements = [];
		particles = [];
		activeLasers = [];
		shipTween.set(window.innerHeight / 2);
		keysPressed.clear();
		skillSpring.target = 1;

		if (typeof window !== 'undefined') {
			document.body.style.overflow = 'hidden';
		}

		const allSkills = getAllSkills();
		if (allSkills.length > 0 && skillElements[0]) {
			setTimeout(() => {
				launchSkill(allSkills[0], 0);
			}, 0);
		}

		const settings = DIFFICULTY_SETTINGS[gameMode][difficulty];
		setTimeout(() => {
			gameLoop = setInterval(() => {
				if (activeSkills.length < settings.maxSkills) {
					const availableSkills = allSkills.filter((skill, index) =>
						skillElements[index] && !activeSkills.some(active => active.text === skill)
					);

					if (availableSkills.length > 0) {
						const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
						const index = allSkills.indexOf(skill);
						launchSkill(skill, index);
					}
				}
			}, settings.spawnInterval);
		}, 100);

		const animate = () => {
			if (!gameActive) return;

			const aircraftPos = getElementPosition(aircraft);
			if (!aircraftPos) return;

			activeSkills = activeSkills.map(skill => {
				const dx = Math.cos(skill.angle) * skill.speed;
				const dy = Math.sin(skill.angle) * skill.speed;

				return {
					...skill,
					currentX: skill.currentX + dx,
					currentY: skill.currentY + dy
				};
			}).filter(skill => {
				const distanceToAircraft = Math.hypot(
					skill.currentX - aircraftPos.x,
					skill.currentY - aircraftPos.y
				);

				// Check for collision with aircraft
				if (distanceToAircraft < 30) {
					lives--;
					soundPlayer?.('collision');
					shipShaking = true;
					setTimeout(() => {
						shipShaking = false;
					}, 500);

					if (lives <= 0) {
						soundPlayer?.('gameOver');
						showGameOver();
					}
					return false;
				}

				// Check if skill has gone off the left side of the screen in classic mode
				if (gameMode === 'classic' && skill.currentX < -50) {
					lives--;
					soundPlayer?.('collision');
					shipShaking = true;
					setTimeout(() => {
						shipShaking = false;
					}, 500);

					if (lives <= 0) {
						soundPlayer?.('gameOver');
						showGameOver();
					}
					return false;
				}

				return true;
			});

			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	};

	const endGame = () => {
		gameActive = false;
		isGameOver = false;
		showDifficultySelect = false;
		if (gameLoop) clearInterval(gameLoop);
		activeSkills = [];
		laserElements = [];
		particles = [];
		activeLasers = [];
		shipTween.set(window.innerHeight / 2);
		keysPressed.clear();
		skillSpring.target = 1;
		difficulty = null;
		if (typeof window !== 'undefined') {
			document.body.style.overflow = '';
		}
		if (dialog?.close) dialog.close();
	};

	const resetSkill = (skill) => {
		soundPlayer?.('wrong');
		if (skill.matchedChars === skill.normalizedText.length) return;

		skill.matchedChars = 0;
		skill.shake = true;
		setTimeout(() => {
			activeSkills = activeSkills.map(s =>
				s.id === skill.id ? { ...s, shake: false } : s
			);
		}, 300);
	};

	// Updated classic mode controls
	const handleClassicControls = (event) => {
		if (!gameActive || gameMode !== 'classic') return;

		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			keysPressed.add(event.key);
		} else if (event.key === ' ') {
			event.preventDefault();
			shootClassicLaser();
		}
	};

	// Add ship movement animation
	const animateShip = () => {
		if (!gameActive || gameMode !== 'classic') return;

		// Update velocity based on keys pressed
		let velocity = 0;
		if (keysPressed.has('ArrowUp')) {
			velocity = -maxShipSpeed;
		} else if (keysPressed.has('ArrowDown')) {
			velocity = maxShipSpeed;
		}

		if (velocity !== 0) {
			const newPosition = shipTween.target + velocity;
			// Constrain ship position to window bounds with some padding
			const minY = 50; // Top padding
			const maxY = window.innerHeight - 50; // Bottom padding
			shipTween.set(Math.max(minY, Math.min(maxY, newPosition)));
		}

		requestAnimationFrame(animateShip);
	};

	// Add keyup handler
	const handleKeyup = (event) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			keysPressed.delete(event.key);
		}
	};

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			endGame();
			return;
		}
		if (!gameActive) return;

		if (gameMode === 'classic') {
			handleClassicControls(event);
			return;
		}

		// Typing mode logic
		event.preventDefault();
		if (event.key === 'Shift') return;

		activeSkills = activeSkills.map(skill => {
			const targetChar = skill.normalizedText[skill.matchedChars];

			if (targetChar === event.key) {
				const newMatchedChars = skill.matchedChars + 1;
				if (newMatchedChars === skill.normalizedText.length) {
					shootLaser(skill);
					return { ...skill, matchedChars: newMatchedChars };
				}
				return { ...skill, matchedChars: newMatchedChars };
			} else if (skill.matchedChars > 0 && event.key !== targetChar) {
				resetSkill(skill);
			}
			return skill;
		});
	};

	const setDifficulty = (level) => {
		difficulty = level;
		startGame();
	};

	// Start the animation loop when game mode is classic
	$effect(() => {
		if (gameMode === 'classic' && gameActive) {
			animateShip();
		}
	});

	onDestroy(() => {
		if (gameLoop) clearInterval(gameLoop);
		if (typeof window !== 'undefined') {
			document.body.style.overflow = '';
		}
	});
</script>

<dialog
	bind:this={dialog}
	class="game-dialog"
	onclose={() => gameActive = false}
>
	<AudioManager
		{gameActive}
		showingMenu={showDifficultySelect}
		{musicEnabled}
		{sfxEnabled}
		on:playSound={(e) => soundPlayer = e.detail}
	/>

	{#if gameActive || isGameOver}
		<!-- Player ship -->
		<div
			class="aircraft"
			class:shaking={shipShaking}
			bind:this={aircraft}
			style="top: {shipTween.current}px;"
			in:fade
		>
			<img src="/ship.svg" alt="spaceship" class="ship-icon" />
		</div>

		<!-- Classic Mode Lasers -->
		{#each activeLasers as laser (laser.id)}
        <div
            class="classic-laser"
            style="
                left: {laser.x}px;
                top: {laser.y}px;
                transform: translate(-50%, -50%);
            "
        ></div>
    {/each}

		<!-- Typing Mode Lasers -->
		{#each laserElements as laser (laser.id)}
			<div
				class="laser-wrapper"
				style="
					position: fixed;
					left: {laser.startX - 20 + (laser.endX - laser.startX) * laser.progress}px;
					top: {laser.startY - 20 + (laser.endY - laser.startY) * laser.progress}px;
					transform: rotate({(laser.angle * 180 / Math.PI)}deg);
					z-index: 45;
				"
			>
				<img
					src="/laser.svg"
					alt="laser"
					class="laser"
				/>
			</div>
		{/each}

		<!-- Particles -->
		{#each particles as particle (particle.id)}
			<div
				class="particle"
				style="
					left: {particle.x}px;
					top: {particle.y}px;
					opacity: {particle.life};
				"
			></div>
		{/each}

		<!-- Flying skills -->
		{#each activeSkills as skill (skill.id)}
			<div
				class="flying-skill skill-tag"
				class:shake={skill.shake}
				style="
					left: {skill.currentX}px;
					top: {skill.currentY}px;
					transform: scale({skillSpring.current});
				"
				in:fade={{duration: 200}}
				out:fade={{duration: 300}}
			>
				{#if gameMode === 'typing'}
					{#each skill.normalizedText.split('') as char, i}
						<span class={i < skill.matchedChars ? 'matched-char' : ''}>
							{char}
						</span>
					{/each}
				{:else}
					{skill.text}
				{/if}
			</div>
		{/each}

		<!-- Game Over screen -->
		{#if isGameOver}
			<div class="game-over" in:fade>
				<h1>Game Over!</h1>
				<p class="final-score">Final Score: {score}</p>
				<p class="high-score">High Score: {highScore}</p>
				<div class="game-over-buttons">
					<button class="retry-button" onclick={() => {
						isGameOver = false;
						difficulty = null;
						showDifficultySelect = true;
						if (dialog?.close) dialog.close();
					}}>
						Play Again
					</button>
					<button class="quit-button" onclick={endGame}>
						Quit
					</button>
				</div>
			</div>
		{/if}

		<!-- Game UI -->
		<div class="game-ui" in:fade>
			<div class="container">
				<div class="game-stats-card">
					<div class="stats">
						<div class="stat">Score: {score}</div>
						<div class="stat">High Score: {highScore}</div>
						<div class="stat">Lives: {lives}</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</dialog>

<!-- Difficulty Selection -->
{#if showDifficultySelect}
	<div class="difficulty-select" in:fade>
		<h1 class="audiowide-regular">SKILL DESTROYER</h1>

		<div class="mode-selector">
			<button
				class="mode-button audiowide-regular"
				class:active={gameMode === 'classic'}
				onclick={() => gameMode = 'classic'}
			>
				Classic Mode
			</button>
			<button
				class="mode-button audiowide-regular"
				class:active={gameMode === 'typing'}
				onclick={() => gameMode = 'typing'}
			>
				Typing Mode
			</button>

		</div>

		<p class="mode-description">
			{#if gameMode === 'typing'}
				Type the letters to destroy the skills before they reach your ship!
			{:else}
				Use UP/DOWN to move and SPACE to shoot!
			{/if}
		</p>

		<div class="difficulty-buttons">
			<button
				class="difficulty-button"
				class:active={difficulty === 'easy'}
				onclick={() => setDifficulty('easy')}
			>
				Easy
			</button>
			<button
				class="difficulty-button"
				class:active={difficulty === 'medium'}
				onclick={() => setDifficulty('medium')}
			>
				Medium
			</button>
			<button
				class="difficulty-button"
				class:active={difficulty === 'hard'}
				onclick={() => setDifficulty('hard')}
			>
				Hard
			</button>
		</div>

		<div class="audio-settings">
			<label class="audio-option">
				<input
					type="checkbox"
					checked={musicEnabled}
					onchange={(e) => toggleMusic(e.target.checked)}
				/>
				<span>Music</span>
			</label>
			<label class="audio-option">
				<input
					type="checkbox"
					checked={sfxEnabled}
					onchange={(e) => toggleSFX(e.target.checked)}
				/>
				<span>Sound Effects</span>
			</label>
		</div>
	</div>
{/if}

<div class="game-controls">
	<button
		class="start-game-button audiowide-regular"
		onclick={startGame}
	>
		PLAY SKILL DESTROYER
	</button>
</div>

<svelte:window
	onkeydown={handleKeydown}
	onkeyup={handleKeyup}
	bind:innerHeight
/>

<style>
	.game-dialog {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(15, 23, 42, 0.6);
		margin: 0;
		padding: 0;
		max-width: none;
		max-height: none;
		border: none;
	}

	.game-dialog::backdrop {
		background: transparent;
	}

	@keyframes shipShake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-5px); }
		75% { transform: translateX(5px); }
	}

	.aircraft {
		position: fixed;
		left: var(--spacing-lg);
		transform: translateY(-50%);
		width: 3rem;
		height: 3rem;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.aircraft.shaking {
		animation: shipShake 0.1s ease-in-out;
	}

	.ship-icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transform: rotate(90deg);
	}

	.classic-laser {
		position: fixed;
		width: 20px;
		height: 4px;
		background-color: orange;
		border-radius: 2px;
		z-index: 45;
		pointer-events: none;
	}

	.laser-wrapper {
		width: 40px;
		height: 40px;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-origin: center center;
	}

	.laser {
		width: 100%;
		height: 100%;
		filter: brightness(1.2);
		object-fit: contain;
	}

	.particle {
		position: fixed;
		width: 6px;
		height: 6px;
		background-color: orange;
		border-radius: 50%;
		pointer-events: none;
		z-index: 45;
		transform: translate(-50%, -50%);
	}

	.flying-skill {
		position: fixed;
		z-index: 100;
		white-space: nowrap;
		background: var(--color-neutral-100);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--color-neutral-700);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transform-origin: center center;
	}

	.matched-char {
		color: var(--color-primary);
		font-weight: var(--font-weight-bold);
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0) scale(var(--skill-scale)); }
		25% { transform: translateX(-5px) rotate(-5deg) scale(var(--skill-scale)); }
		75% { transform: translateX(5px) rotate(5deg) scale(var(--skill-scale)); }
	}

	.shake {
		--skill-scale: 1.3;
		animation: shake 0.1s ease-in-out infinite;
	}

	.game-ui {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--spacing-md);
		z-index: 50;
	}

	.game-stats-card {
		background: white;
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		box-shadow: var(--shadow-md);
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 42rem;
		margin: 0 auto;
	}

	.stats {
		display: flex;
		gap: var(--spacing-lg);
	}

	.stat {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-medium);
	}

	.controls {
		display: flex;
		gap: var(--spacing-md);
		align-items: center;
	}

	.instructions {
		font-size: var(--font-size-sm);
		color: var(--color-neutral-600);
	}

	.mode-selector {
		display: flex;
		gap: var(--spacing-md);
		margin: var(--spacing-xl) 0;
	}

	.mode-button {
		padding: var(--spacing-md) var(--spacing-xl);
		font-size: var(--font-size-xl);
		background: var(--color-neutral-200);
		color: var(--color-neutral-700);
		border-radius: var(--radius-lg);
		font-weight: var(--font-weight-medium);
		transition: all 0.2s;
		min-width: 200px;
	}

	.mode-button:hover {
		background: var(--color-neutral-300);
		transform: translateY(-2px);
	}

	.mode-button.active {
		background: var(--color-primary-light);
		color: white;
	}

	.mode-description {
		font-size: var(--font-size-lg);
		color: white;
		margin: var(--spacing-md) 0;
	}

	.difficulty-select {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(15, 23, 42, 0.9);
		z-index: 100;
		padding: var(--spacing-xl);
		text-align: center;
		color: white;
	}

	.difficulty-select h2 {
		font-size: var(--font-size-3xl);
		margin-bottom: var(--spacing-md);
	}

	.difficulty-instructions {
		max-width: 600px;
		margin-bottom: var(--spacing-sm);
		font-size: var(--font-size-lg);
		line-height: 1.2;
	}

	.difficulty-buttons {
		display: flex;
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
	}

	.difficulty-button {
		padding: var(--spacing-md) var(--spacing-xl);
		font-size: var(--font-size-xl);
		background: var(--color-neutral-200);
		color: var(--color-neutral-700);
		border-radius: var(--radius-lg);
		font-weight: var(--font-weight-medium);
		transition: all 0.2s;
		min-width: 150px;
	}

	.difficulty-button:hover {
		background: var(--color-neutral-300);
		transform: translateY(-2px);
	}

	.difficulty-button.active {
		background: var(--color-primary-light);
		color: white;
	}

	.end-game-button {
		padding: var(--spacing-xs) var(--spacing-md);
		background: var(--color-error);
		color: white;
		border-radius: var(--radius-sm);
		font-weight: var(--font-weight-medium);
		transition: all 0.2s;
	}

	.end-game-button:hover {
		background: color-mix(in srgb, var(--color-error) 80%, black);
	}

	.start-game-button {
		background: var(--color-primary);
		color: white;
		padding: var(--spacing-md) var(--spacing-md);
		border-radius: 15px;
		box-shadow: var(--shadow-lg);
		font-weight: var(--font-weight-medium);
		transition: all 0.2s;
		font-size: 14px;
	}

	.start-game-button:hover {
		background: color-mix(in srgb, var(--color-primary) 80%, black);
		transform: translateY(-2px);
	}

	.game-over {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(15, 23, 42, 0.9);
		color: white;
		z-index: 100;
	}

	.game-over h1 {
		font-size: var(--font-size-4xl);
		margin-bottom: var(--spacing-lg);
	}

	.final-score {
		font-size: var(--font-size-2xl);
		margin-bottom: var(--spacing-md);
	}

	.high-score {
		font-size: var(--font-size-xl);
		color: var(--color-primary-light);
		margin-bottom: var(--spacing-xl);
	}

	.game-over-buttons {
		display: flex;
		gap: var(--spacing-md);
	}

	.retry-button {
		padding: var(--spacing-md) var(--spacing-xl);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-lg);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-medium);
		transition: all 0.2s;
	}

	.retry-button:hover {
		background: color-mix(in srgb, var(--color-primary) 80%, black);
		transform: translateY(-2px);
	}

	.quit-button {
		padding: var(--spacing-md) var(--spacing-xl);
		background: var(--color-neutral-600);
		color: white;
		border-radius: var(--radius-lg);
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-medium);
		transition: all 0.2s;
	}

	.quit-button:hover {
		background: var(--color-neutral-700);
		transform: translateY(-2px);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--spacing-md);
	}

	.game-controls {
		position: fixed;
		top: var(--spacing-md);
		right: var(--spacing-md);
		display: flex;
		gap: var(--spacing-sm);
		align-items: center;
		z-index: 50;
	}

	.audio-settings {
		display: flex;
		gap: var(--spacing-xl);
		margin-top: var(--spacing-xl);
		justify-content: center;
	}

	.audio-option {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: white;
		font-size: var(--font-size-lg);
		cursor: pointer;
	}

	.audio-option input[type="checkbox"] {
		width: 1.2em;
		height: 1.2em;
		cursor: pointer;
	}
</style>