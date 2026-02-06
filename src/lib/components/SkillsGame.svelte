<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import AudioManager from './AudioManager.svelte';

	const { skills } = $props();

	// Audio state
	let musicEnabled = $state(true);
	let sfxEnabled = $state(true);
	let soundPlayer = $state(null);

	// Category colors for visual distinction
	const CATEGORY_COLORS = {
		programming: '#3b82f6',      // blue
		frameworks: '#8b5cf6',       // purple
		'Artificial Intelligence': '#ec4899', // pink
		devops: '#f97316',           // orange
		databases: '#14b8a6',        // teal
		vfx: '#eab308',              // yellow
		'Game Dev': '#22c55e',          // green
		methodologies: '#6366f1'     // indigo
	};

	const CATEGORY_MESSAGES = {
		programming: "Programming mastery! Kevin has 19 years of experience with Python, JavaScript, TypeScript, and C++.",
		frameworks: "Frameworks complete! From Svelte to React to Django, Kevin builds with modern tools.",
		'Artificial Intelligence': "AI expertise unlocked! Kevin builds with OpenAI, LangChain, and custom AI pipelines.",
		devops: "DevOps done! Docker, CI/CD, AWS - Kevin ships and scales production systems.",
		databases: "Database pro! PostgreSQL, MongoDB, Redis - Kevin designs data solutions.",
		vfx: "VFX pipeline master! Flow Production Tracking, Maya, Nuke - deep industry expertise.",
		'Game Dev': "Game dev skills! Building with Defold and Godot for interactive experiences.",
		methodologies: "Leadership complete! Product management, architecture, and team mentorship."
	};

	const CATEGORY_ORDER = [
		'programming',
		'frameworks',
		'Artificial Intelligence',
		'devops',
		'databases',
		'vfx',
		'Game Dev',
		'methodologies'
	];

	// Unique ID counter
	let nextId = 0;
	const uid = () => nextId++;

	// Game state
	let gameActive = $state(false);
	let showMenu = $state(false);
	let isGameOver = $state(false);
	let score = $state(0);
	let highScore = $state(0);
	let mounted = $state(false);
	let lives = $state(3);
	const MAX_LIVES = 3;

	// Ship state
	let shipX = $state(100);
	let shipY = $state(300);
	let shipVelocityX = $state(0);
	let shipVelocityY = $state(0);
	const SHIP_SPEED = 5;
	const SHIP_FRICTION = 0.92;

	// Game objects
	let floatingSkills = $state([]);
	let bugs = $state([]);
	let bullets = $state([]);
	let powerUps = $state([]);
	let particles = $state([]);
	let stars = $state([]);
	let completionMessage = $state(null);

	// Shooting state
	let canShoot = $state(true);
	let shootCooldown = $state(200); // ms between shots
	let rapidFire = $state(false);
	let rapidFireTimer = $state(null);
	let rapidFireExpiry = $state(0);
	const BULLET_SPEED = 10;

	// Weapon types
	let currentWeapon = $state('normal'); // normal, spread
	let weaponTimer = $state(null);
	let weaponExpiry = $state(0);

	// Difficulty scaling
	let difficultyLevel = $state(1);
	let difficultyInterval = $state(null);

	// Progress tracking
	let collectedSkills = $state({});
	let categoryProgress = $state({});

	// Input state
	let keysPressed = $state(new Set());
	let touchStart = $state(null);

	// Canvas dimensions
	let canvasWidth = $state(800);
	let canvasHeight = $state(600);
	let gameContainer = $state(null);

	// Animation
	let animationFrame = $state(null);
	let spawnInterval = $state(null);
	let bugSpawnInterval = $state(null);
	let powerUpSpawnInterval = $state(null);

	onMount(() => {
		mounted = true;
		const savedHighScore = localStorage.getItem('skillQuestHighScore');
		if (savedHighScore) {
			highScore = parseInt(savedHighScore, 10);
		}
		initStars();
	});

	const initStars = () => {
		const newStars = [];
		for (let i = 0; i < 100; i++) {
			newStars.push({
				x: Math.random() * 1200,
				y: Math.random() * 800,
				size: Math.random() * 2 + 0.5,
				speed: Math.random() * 0.5 + 0.2,
				layer: Math.floor(Math.random() * 3)
			});
		}
		stars = newStars;
	};

	const getAllSkills = () => {
		const allSkills = [];
		for (const category of CATEGORY_ORDER) {
			if (skills[category]) {
				for (const skill of skills[category]) {
					allSkills.push({ name: skill, category });
				}
			}
		}
		return allSkills;
	};

	const initProgress = () => {
		const progress = {};
		const collected = {};
		for (const category of CATEGORY_ORDER) {
			progress[category] = { collected: 0, total: skills[category]?.length || 0 };
			collected[category] = new Set();
		}
		categoryProgress = progress;
		collectedSkills = collected;
	};

	const spawnSkill = () => {
		if (!gameActive) return;

		const allSkills = getAllSkills();
		const uncollected = allSkills.filter(s => !collectedSkills[s.category]?.has(s.name));

		if (uncollected.length === 0) return;

		const skill = uncollected[Math.floor(Math.random() * uncollected.length)];
		const fromRight = Math.random() > 0.3;

		floatingSkills = [...floatingSkills, {
			id: uid(),
			name: skill.name,
			category: skill.category,
			x: fromRight ? canvasWidth + 50 : -50,
			y: Math.random() * (canvasHeight - 100) + 50,
			velocityX: fromRight ? -(Math.random() * 1.5 + 0.5) : (Math.random() * 1.5 + 0.5),
			velocityY: (Math.random() - 0.5) * 0.5,
			size: 40,
			pulse: 0
		}];
	};

	// Enemy types with different behaviors
	const ENEMY_TYPES = {
		bug: { emoji: '🐛', speed: 2.5, behavior: 'straight', points: 5 },
		spider: { emoji: '🕷️', speed: 1.5, behavior: 'sine', points: 8 },
		virus: { emoji: '🦠', speed: 2, behavior: 'chase', points: 10 },
		skull: { emoji: '💀', speed: 4, behavior: 'fast', points: 15 }
	};

	const spawnBug = () => {
		if (!gameActive) return;

		// More enemies at higher difficulty
		const maxCount = difficultyLevel >= 4 ? 3 : difficultyLevel >= 2 ? 2 : 1;
		const count = Math.random() > 0.5 ? maxCount : Math.max(1, maxCount - 1);
		const speedMult = 1 + (difficultyLevel - 1) * 0.15;

		for (let i = 0; i < count; i++) {
			// Harder enemies appear more at higher difficulty
			const roll = Math.random();
			let type;
			if (difficultyLevel <= 2) {
				if (roll < 0.6) type = 'bug';
				else if (roll < 0.85) type = 'spider';
				else type = 'virus';
			} else if (difficultyLevel <= 4) {
				if (roll < 0.35) type = 'bug';
				else if (roll < 0.6) type = 'spider';
				else if (roll < 0.85) type = 'virus';
				else type = 'skull';
			} else {
				if (roll < 0.2) type = 'bug';
				else if (roll < 0.45) type = 'spider';
				else if (roll < 0.75) type = 'virus';
				else type = 'skull';
			}

			const config = ENEMY_TYPES[type];

			bugs = [...bugs, {
				id: uid() + i,
				type,
				emoji: config.emoji,
				x: canvasWidth + 30 + (i * 50),
				y: Math.random() * (canvasHeight - 60) + 30,
				velocityX: -(config.speed * speedMult + Math.random()),
				velocityY: type === 'straight' ? 0 : (Math.random() - 0.5) * 1.5,
				behavior: config.behavior,
				points: config.points,
				phase: Math.random() * Math.PI * 2,
				size: 25
			}];
		}
	};

	const increaseDifficulty = () => {
		if (!gameActive) return;
		difficultyLevel++;

		// Spawn bugs faster as difficulty increases
		if (bugSpawnInterval) clearInterval(bugSpawnInterval);
		const newBugInterval = Math.max(600, 2000 - (difficultyLevel - 1) * 200);
		bugSpawnInterval = setInterval(spawnBug, newBugInterval);

		// Spawn power-ups slightly more often too
		if (powerUpSpawnInterval) clearInterval(powerUpSpawnInterval);
		const newPowerUpInterval = Math.max(4000, 7000 - (difficultyLevel - 1) * 500);
		powerUpSpawnInterval = setInterval(spawnPowerUp, newPowerUpInterval);
	};

	const POWER_UP_TYPES = {
		rapidFire: { emoji: '⚡', color: '#fbbf24', duration: 10000 },
		extraLife: { emoji: '❤️', color: '#ef4444', duration: 0 },
		shield: { emoji: '🛡️', color: '#3b82f6', duration: 10000 },
		spread: { emoji: '🔱', color: '#a855f7', duration: 12000 }
	};

	let shielded = $state(false);
	let shieldTimer = $state(null);
	let shieldExpiry = $state(0);

	// Track if any power-up is active (for ship glow)
	let poweredUp = $derived(rapidFire || shielded || currentWeapon !== 'normal');

	const spawnPowerUp = () => {
		if (!gameActive) return;

		const types = Object.keys(POWER_UP_TYPES);
		const type = types[Math.floor(Math.random() * types.length)];

		powerUps = [...powerUps, {
			id: uid(),
			type,
			x: canvasWidth + 30,
			y: Math.random() * (canvasHeight - 100) + 50,
			velocityX: -(Math.random() + 1),
			size: 30
		}];
	};

	const shoot = () => {
		if (!gameActive || !canShoot) return;

		const cooldown = rapidFire ? 100 : shootCooldown;
		soundPlayer?.('laser');

		const newBullets = [];

		// Forward shot (always)
		newBullets.push({
			id: uid(),
			x: shipX + 25,
			y: shipY,
			velocityX: BULLET_SPEED,
			velocityY: 0,
			size: 8
		});

		// Spread shot: 2 angled bullets
		if (currentWeapon === 'spread') {
			const spreadAngle = 0.3;
			newBullets.push({
				id: uid(),
				x: shipX + 20,
				y: shipY - 5,
				velocityX: Math.cos(-spreadAngle) * BULLET_SPEED,
				velocityY: Math.sin(-spreadAngle) * BULLET_SPEED,
				size: 6
			});
			newBullets.push({
				id: uid(),
				x: shipX + 20,
				y: shipY + 5,
				velocityX: Math.cos(spreadAngle) * BULLET_SPEED,
				velocityY: Math.sin(spreadAngle) * BULLET_SPEED,
				size: 6
			});
		}

		bullets = [...bullets, ...newBullets];

		canShoot = false;
		setTimeout(() => {
			canShoot = true;
		}, cooldown);
	};

	const powerDownSound = () => {
		soundPlayer?.('powerDown');
	};

	const collectPowerUp = (powerUp) => {
		const type = powerUp.type;
		const config = POWER_UP_TYPES[type];

		soundPlayer?.('powerUp');
		createCollectParticles(powerUp.x, powerUp.y, config.color);
		powerUps = powerUps.filter(p => p.id !== powerUp.id);
		score += 5;

		const now = Date.now();

		if (type === 'rapidFire') {
			const remaining = rapidFire ? Math.max(0, rapidFireExpiry - now) : 0;
			rapidFire = true;
			if (rapidFireTimer) clearTimeout(rapidFireTimer);
			const totalDuration = remaining + config.duration;
			rapidFireExpiry = now + totalDuration;
			rapidFireTimer = setTimeout(() => {
				rapidFire = false;
				powerDownSound();
			}, totalDuration);
		} else if (type === 'extraLife') {
			lives = Math.min(lives + 1, MAX_LIVES);
		} else if (type === 'shield') {
			const remaining = shielded ? Math.max(0, shieldExpiry - now) : 0;
			shielded = true;
			if (shieldTimer) clearTimeout(shieldTimer);
			const totalDuration = remaining + config.duration;
			shieldExpiry = now + totalDuration;
			shieldTimer = setTimeout(() => {
				shielded = false;
				powerDownSound();
			}, totalDuration);
		} else if (type === 'spread') {
			const remaining = currentWeapon === 'spread' ? Math.max(0, weaponExpiry - now) : 0;
			currentWeapon = 'spread';
			if (weaponTimer) clearTimeout(weaponTimer);
			const totalDuration = remaining + config.duration;
			weaponExpiry = now + totalDuration;
			weaponTimer = setTimeout(() => {
				currentWeapon = 'normal';
				powerDownSound();
			}, totalDuration);
		}
	};

	const createCollectParticles = (x, y, color) => {
		const newParticles = [];
		for (let i = 0; i < 12; i++) {
			const angle = (i / 12) * Math.PI * 2;
			newParticles.push({
				id: uid(),
				x,
				y,
				velocityX: Math.cos(angle) * (Math.random() * 3 + 2),
				velocityY: Math.sin(angle) * (Math.random() * 3 + 2),
				color,
				life: 1,
				size: Math.random() * 4 + 2
			});
		}
		particles = [...particles, ...newParticles];
	};

	const collectSkill = (skill) => {
		const category = skill.category;
		if (!collectedSkills[category].has(skill.name)) {
			soundPlayer?.('skillCaught');
			collectedSkills[category].add(skill.name);
			categoryProgress[category].collected++;
			score += 10;

			createCollectParticles(skill.x, skill.y, CATEGORY_COLORS[category]);

			// Check if category complete
			if (categoryProgress[category].collected === categoryProgress[category].total) {
				showCategoryComplete(category);
			}

			// Check if all categories complete
			const allComplete = CATEGORY_ORDER.every(cat =>
				categoryProgress[cat].collected === categoryProgress[cat].total
			);
			if (allComplete) {
				gameWon();
			}

			if (score > highScore) {
				highScore = score;
				localStorage.setItem('skillQuestHighScore', highScore.toString());
			}
		}

		floatingSkills = floatingSkills.filter(s => s.id !== skill.id);
	};

	const showCategoryComplete = (category) => {
		completionMessage = {
			category,
			message: CATEGORY_MESSAGES[category],
			color: CATEGORY_COLORS[category]
		};
		setTimeout(() => {
			completionMessage = null;
		}, 3000);
	};

	const hitBug = (bug) => {
		// Shield protects from damage
		if (shielded) {
			soundPlayer?.('explosion');
			createCollectParticles(bug.x, bug.y, '#3b82f6');
			bugs = bugs.filter(b => b.id !== bug.id);
			return;
		}

		// Lose a life
		soundPlayer?.('collision');
		lives--;

		// Slow down the ship
		shipVelocityX *= 0.3;
		shipVelocityY *= 0.3;
		score = Math.max(0, score - 5);

		createCollectParticles(bug.x, bug.y, '#ef4444');
		bugs = bugs.filter(b => b.id !== bug.id);

		// Check for game over
		if (lives <= 0) {
			gameLost();
		}
	};

	const clearAllTimers = () => {
		if (spawnInterval) clearInterval(spawnInterval);
		if (bugSpawnInterval) clearInterval(bugSpawnInterval);
		if (powerUpSpawnInterval) clearInterval(powerUpSpawnInterval);
		if (difficultyInterval) clearInterval(difficultyInterval);
		if (rapidFireTimer) clearTimeout(rapidFireTimer);
		if (shieldTimer) clearTimeout(shieldTimer);
		if (weaponTimer) clearTimeout(weaponTimer);
		if (animationFrame) cancelAnimationFrame(animationFrame);
	};

	const gameLost = () => {
		soundPlayer?.('gameOver');
		isGameOver = true;
		gameActive = false;
		clearAllTimers();
	};

	const gameWon = () => {
		isGameOver = true;
		gameActive = false;
		clearAllTimers();
	};

	const updateGame = () => {
		if (!gameActive) return;

		// Update ship position based on input
		if (keysPressed.has('ArrowUp') || keysPressed.has('w') || keysPressed.has('W')) {
			shipVelocityY -= SHIP_SPEED * 0.15;
		}
		if (keysPressed.has('ArrowDown') || keysPressed.has('s') || keysPressed.has('S')) {
			shipVelocityY += SHIP_SPEED * 0.15;
		}
		if (keysPressed.has('ArrowLeft') || keysPressed.has('a') || keysPressed.has('A')) {
			shipVelocityX -= SHIP_SPEED * 0.15;
		}
		if (keysPressed.has('ArrowRight') || keysPressed.has('d') || keysPressed.has('D')) {
			shipVelocityX += SHIP_SPEED * 0.15;
		}

		// Apply friction
		shipVelocityX *= SHIP_FRICTION;
		shipVelocityY *= SHIP_FRICTION;

		// Clamp velocity
		const maxSpeed = SHIP_SPEED;
		const speed = Math.sqrt(shipVelocityX ** 2 + shipVelocityY ** 2);
		if (speed > maxSpeed) {
			shipVelocityX = (shipVelocityX / speed) * maxSpeed;
			shipVelocityY = (shipVelocityY / speed) * maxSpeed;
		}

		// Update position
		shipX += shipVelocityX;
		shipY += shipVelocityY;

		// Constrain to bounds
		shipX = Math.max(20, Math.min(canvasWidth - 20, shipX));
		shipY = Math.max(20, Math.min(canvasHeight - 20, shipY));

		// Update stars (parallax)
		stars = stars.map(star => ({
			...star,
			x: star.x - star.speed * (1 + star.layer * 0.5),
			...(star.x < -10 ? { x: canvasWidth + 10, y: Math.random() * canvasHeight } : {})
		}));

		// Update floating skills
		floatingSkills = floatingSkills.map(skill => ({
			...skill,
			x: skill.x + skill.velocityX,
			y: skill.y + skill.velocityY,
			pulse: (skill.pulse + 0.05) % (Math.PI * 2)
		})).filter(skill => skill.x > -100 && skill.x < canvasWidth + 100);

		// Update bugs with different behaviors
		bugs = bugs.map(bug => {
			let newY = bug.y;
			let newVelocityY = bug.velocityY;

			switch (bug.behavior) {
				case 'sine':
					// Sine wave movement
					bug.phase += 0.08;
					newY = bug.y + Math.sin(bug.phase) * 3;
					break;
				case 'chase':
					// Chase the player
					const dy = shipY - bug.y;
					newVelocityY = Math.sign(dy) * 1.5;
					newY = bug.y + newVelocityY;
					break;
				case 'fast':
					// Just moves fast in a straight line
					newY = bug.y + bug.velocityY * 0.3;
					break;
				default:
					// Straight movement with slight drift
					newY = bug.y + bug.velocityY;
			}

			// Keep bugs in bounds
			newY = Math.max(30, Math.min(canvasHeight - 30, newY));

			return {
				...bug,
				x: bug.x + bug.velocityX,
				y: newY,
				velocityY: newVelocityY
			};
		}).filter(bug => bug.x > -50);

		// Update bullets
		bullets = bullets.map(bullet => ({
			...bullet,
			x: bullet.x + bullet.velocityX,
			y: bullet.y + (bullet.velocityY || 0)
		})).filter(bullet =>
			bullet.x > -20 && bullet.x < canvasWidth + 20 &&
			bullet.y > -20 && bullet.y < canvasHeight + 20
		);

		// Update power-ups
		powerUps = powerUps.map(p => ({
			...p,
			x: p.x + p.velocityX
		})).filter(p => p.x > -50);

		// Check bullet-bug collisions
		const bulletsToRemove = new Set();
		const bugsToRemove = new Set();
		let scoreGain = 0;

		for (const bullet of bullets) {
			for (const bug of bugs) {
				if (bugsToRemove.has(bug.id)) continue;
				const dx = bullet.x - bug.x;
				const dy = bullet.y - bug.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < 25) {
					soundPlayer?.('explosion');
					createCollectParticles(bug.x, bug.y, '#22c55e');
					scoreGain += bug.points || 5;
					bugsToRemove.add(bug.id);
					bulletsToRemove.add(bullet.id);
					break;
				}
			}
		}

		if (bugsToRemove.size > 0) {
			bugs = bugs.filter(b => !bugsToRemove.has(b.id));
			bullets = bullets.filter(b => !bulletsToRemove.has(b.id));
			score += scoreGain;
		}

		// Check power-up collisions
		for (const powerUp of powerUps) {
			const dx = shipX - powerUp.x;
			const dy = shipY - powerUp.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 35) {
				collectPowerUp(powerUp);
			}
		}

		// Update particles
		particles = particles.map(p => ({
			...p,
			x: p.x + p.velocityX,
			y: p.y + p.velocityY,
			velocityX: p.velocityX * 0.95,
			velocityY: p.velocityY * 0.95,
			life: p.life - 0.03
		})).filter(p => p.life > 0);

		// Check collisions with skills (use bounding box for better hit detection)
		// Collect hits first, then process — avoids mutating $state arrays during iteration
		const skillsToCollect = [];
		for (const skill of floatingSkills) {
			const skillWidth = Math.max(80, skill.name.length * 8 + 32);
			const skillHeight = 36;
			const halfWidth = skillWidth / 2;
			const halfHeight = skillHeight / 2;

			if (shipX > skill.x - halfWidth - 20 &&
				shipX < skill.x + halfWidth + 20 &&
				shipY > skill.y - halfHeight - 20 &&
				shipY < skill.y + halfHeight + 20) {
				skillsToCollect.push(skill);
			}
		}
		for (const skill of skillsToCollect) {
			collectSkill(skill);
		}

		// Check collisions with bugs
		const bugsToHit = [];
		for (const bug of bugs) {
			const dx = shipX - bug.x;
			const dy = shipY - bug.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 30) {
				bugsToHit.push(bug);
			}
		}
		for (const bug of bugsToHit) {
			hitBug(bug);
		}

		animationFrame = requestAnimationFrame(updateGame);
	};

	const startGame = () => {
		showMenu = false;
		gameActive = true;
		isGameOver = false;
		score = 0;
		lives = MAX_LIVES;
		shipX = 100;
		shipY = canvasHeight / 2;
		shipVelocityX = 0;
		shipVelocityY = 0;
		floatingSkills = [];
		bugs = [];
		bullets = [];
		powerUps = [];
		particles = [];
		keysPressed.clear();
		canShoot = true;
		rapidFire = false;
		rapidFireExpiry = 0;
		shielded = false;
		shieldExpiry = 0;
		currentWeapon = 'normal';
		weaponExpiry = 0;
		difficultyLevel = 1;
		if (rapidFireTimer) clearTimeout(rapidFireTimer);
		if (shieldTimer) clearTimeout(shieldTimer);
		if (weaponTimer) clearTimeout(weaponTimer);
		if (difficultyInterval) clearInterval(difficultyInterval);

		initProgress();

		if (typeof window !== 'undefined') {
			document.body.style.overflow = 'hidden';
		}

		// Start spawning
		spawnSkill();
		spawnInterval = setInterval(spawnSkill, 1500);
		bugSpawnInterval = setInterval(spawnBug, 2000);
		powerUpSpawnInterval = setInterval(spawnPowerUp, 7000);

		// Increase difficulty every 15 seconds
		difficultyInterval = setInterval(increaseDifficulty, 15000);

		animationFrame = requestAnimationFrame(updateGame);
	};

	const endGame = () => {
		gameActive = false;
		isGameOver = false;
		showMenu = false;
		clearAllTimers();
		floatingSkills = [];
		bugs = [];
		bullets = [];
		powerUps = [];
		particles = [];
		keysPressed.clear();
		if (typeof window !== 'undefined') {
			document.body.style.overflow = '';
		}
	};

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			endGame();
			return;
		}
		if (!gameActive) return;

		if (event.key === ' ' || event.code === 'Space') {
			event.preventDefault();
			shoot();
			return;
		}

		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key)) {
			event.preventDefault();
			keysPressed.add(event.key);
		}
	};

	const handleKeyup = (event) => {
		keysPressed.delete(event.key);
	};

	const handleTouchStart = (event) => {
		if (!gameActive) return;
		const touch = event.touches[0];
		touchStart = { x: touch.clientX, y: touch.clientY };
	};

	const handleTouchMove = (event) => {
		if (!gameActive || !touchStart) return;
		event.preventDefault();
		const touch = event.touches[0];
		const dx = touch.clientX - touchStart.x;
		const dy = touch.clientY - touchStart.y;

		shipVelocityX += dx * 0.01;
		shipVelocityY += dy * 0.01;

		touchStart = { x: touch.clientX, y: touch.clientY };
	};

	const handleTouchEnd = () => {
		touchStart = null;
	};

	const openMenu = () => {
		showMenu = true;
	};

	onDestroy(() => {
		if (spawnInterval) clearInterval(spawnInterval);
		if (bugSpawnInterval) clearInterval(bugSpawnInterval);
		if (animationFrame) cancelAnimationFrame(animationFrame);
		if (typeof window !== 'undefined') {
			document.body.style.overflow = '';
		}
	});

	// Update canvas dimensions on mount
	$effect(() => {
		if (gameContainer && mounted) {
			const updateDimensions = () => {
				canvasWidth = window.innerWidth;
				canvasHeight = window.innerHeight;
			};
			updateDimensions();
			window.addEventListener('resize', updateDimensions);
			return () => window.removeEventListener('resize', updateDimensions);
		}
	});
</script>

<!-- Audio Manager -->
<AudioManager
	{gameActive}
	showingMenu={showMenu}
	{musicEnabled}
	{sfxEnabled}
	on:playSound={(e) => soundPlayer = e.detail}
/>

<!-- Menu Screen -->
{#if showMenu && !gameActive}
	<div class="menu-overlay" in:fade>
		<div class="menu-content">
			<h1 class="audiowide-regular game-title">SKILL QUEST</h1>
			<p class="game-subtitle">Collect Kevin's skills through the starfield</p>

			<div class="instructions">
				<p><strong>Arrow Keys / WASD</strong> to move &bull; <strong>Space</strong> to shoot</p>
				<p>Collect <span class="highlight-skill">skill orbs</span> to fill progress bars</p>
				<p>Destroy enemies: 🐛 🕷️ 🦠 💀 — difficulty increases over time!</p>
				<p>Power-ups: ⚡ Rapid Fire | 🛡️ Shield | ❤️ Life | 🔱 Spread</p>
			</div>

			<div class="audio-settings">
				<label class="audio-option">
					<input type="checkbox" bind:checked={musicEnabled} />
					<span>Music</span>
				</label>
				<label class="audio-option">
					<input type="checkbox" bind:checked={sfxEnabled} />
					<span>Sound FX</span>
				</label>
			</div>

			<div class="menu-buttons">
				<button class="start-button audiowide-regular" onclick={startGame}>
					START QUEST
				</button>
				<button class="cancel-button audiowide-regular" onclick={() => showMenu = false}>
					CANCEL
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Game Screen -->
{#if gameActive || isGameOver}
	<div
		class="game-container"
		bind:this={gameContainer}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		role="application"
		aria-label="Skill Quest game area"
	>
		<!-- Starfield -->
		<svg class="starfield" viewBox="0 0 {canvasWidth} {canvasHeight}">
			{#each stars as star}
				<circle
					cx={star.x}
					cy={star.y}
					r={star.size}
					fill="white"
					opacity={0.3 + star.layer * 0.2}
				/>
			{/each}
		</svg>

		<!-- Particles -->
		{#each particles as particle (particle.id)}
			<div
				class="particle"
				style="
					left: {particle.x}px;
					top: {particle.y}px;
					width: {particle.size}px;
					height: {particle.size}px;
					background: {particle.color};
					opacity: {particle.life};
				"
			></div>
		{/each}

		<!-- Floating Skills -->
		{#each floatingSkills as skill (skill.id)}
			<div
				class="skill-orb"
				style="
					left: {skill.x}px;
					top: {skill.y}px;
					background: {CATEGORY_COLORS[skill.category]};
					transform: translate(-50%, -50%) scale({1 + Math.sin(skill.pulse) * 0.1});
					box-shadow: 0 0 20px {CATEGORY_COLORS[skill.category]}80;
				"
			>
				<span class="skill-name">{skill.name}</span>
			</div>
		{/each}

		<!-- Bullets -->
		{#each bullets as bullet (bullet.id)}
			<div
				class="bullet"
				style="
					left: {bullet.x}px;
					top: {bullet.y}px;
					width: {bullet.size * 2}px;
					height: {bullet.size}px;
				"
			></div>
		{/each}

		<!-- Power-ups -->
		{#each powerUps as powerUp (powerUp.id)}
			<div
				class="power-up"
				style="
					left: {powerUp.x}px;
					top: {powerUp.y}px;
					background: {POWER_UP_TYPES[powerUp.type].color}40;
					border-color: {POWER_UP_TYPES[powerUp.type].color};
				"
			>
				{POWER_UP_TYPES[powerUp.type].emoji}
			</div>
		{/each}

		<!-- Bugs/Enemies -->
		{#each bugs as bug (bug.id)}
			<div
				class="bug"
				style="
					left: {bug.x}px;
					top: {bug.y}px;
				"
			>
				{bug.emoji}
			</div>
		{/each}

		<!-- Ship -->
		<div
			class="ship"
			class:shielded={shielded}
			class:powered-up={poweredUp}
			style="
				left: {shipX}px;
				top: {shipY}px;
			"
		>
			<img src="/ship.svg" alt="spaceship" class="ship-icon" />
			{#if shielded}
				<div class="shield-bubble"></div>
			{/if}
		</div>

		<!-- Progress Sidebar -->
		<div class="progress-sidebar">
			<div class="score-display">
				<div class="audiowide-regular">SCORE: {score}</div>
				<div class="high-score">HIGH: {highScore}</div>
			</div>

			<div class="lives-display">
				{#each Array(MAX_LIVES) as _, i}
					<span class="heart" class:active={i < lives}>❤️</span>
				{/each}
			</div>

			<div class="difficulty-display">
				LVL {difficultyLevel}
			</div>

			{#if rapidFire}
				<div class="power-up-indicator rapid-fire">⚡ RAPID FIRE</div>
			{/if}
			{#if shielded}
				<div class="power-up-indicator shield-ind">🛡️ SHIELD</div>
			{/if}
			{#if currentWeapon === 'spread'}
				<div class="power-up-indicator weapon-spread">🔱 SPREAD</div>
			{/if}

			{#each CATEGORY_ORDER as category}
				{@const progress = categoryProgress[category]}
				{@const percentage = progress ? (progress.collected / progress.total) * 100 : 0}
				<div class="category-progress">
					<div class="category-label" style="color: {CATEGORY_COLORS[category]}">
						{category}
					</div>
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="
								width: {percentage}%;
								background: {CATEGORY_COLORS[category]};
							"
						></div>
					</div>
					<div class="progress-count">
						{progress?.collected || 0}/{progress?.total || 0}
					</div>
				</div>
			{/each}
		</div>

		<!-- Completion Message -->
		{#if completionMessage}
			<div class="completion-message" in:fade out:fade>
				<div
					class="completion-card"
					style="border-color: {completionMessage.color}"
				>
					<h3 style="color: {completionMessage.color}">{completionMessage.category} Complete!</h3>
					<p>{completionMessage.message}</p>
				</div>
			</div>
		{/if}

		<!-- Game Over / Win Screen -->
		{#if isGameOver}
			<div class="game-over-overlay" in:fade>
				<div class="game-over-content">
					{#if lives > 0}
						<h1 class="audiowide-regular">🎉 QUEST COMPLETE! 🎉</h1>
						<p class="final-score">Final Score: {score}</p>
						<p class="win-message">You've collected all of Kevin's skills!</p>
					{:else}
						<h1 class="audiowide-regular game-over-title">💀 GAME OVER 💀</h1>
						<p class="final-score">Final Score: {score}</p>
						<p class="high-score-display">High Score: {highScore}</p>
						<p class="lose-message">The bugs got you! Try again?</p>
					{/if}
					<div class="game-over-buttons">
						<button class="retry-button audiowide-regular" onclick={startGame}>
							PLAY AGAIN
						</button>
						<button class="quit-button audiowide-regular" onclick={endGame}>
							EXIT
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Controls hint -->
		{#if gameActive && !isGameOver}
			<div class="controls-hint">
				<span>Arrow Keys / WASD to move • SPACE to shoot • ESC to exit</span>
			</div>
		{/if}
	</div>
{/if}

<!-- Play Button (always visible when not in game) -->
{#if !gameActive && !showMenu}
	<div class="game-controls">
		<button
			class="start-game-button audiowide-regular"
			onclick={openMenu}
		>
			PLAY SKILL QUEST
		</button>
	</div>
{/if}

<svelte:window
	onkeydown={handleKeydown}
	onkeyup={handleKeyup}
/>

<style>
	.game-container {
		position: fixed;
		inset: 0;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
		z-index: 1000;
		overflow: hidden;
	}

	.starfield {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.ship {
		position: absolute;
		width: 50px;
		height: 50px;
		transform: translate(-50%, -50%);
		z-index: 100;
		transition: transform 0.1s ease-out;
	}

	.ship-icon {
		width: 100%;
		height: 100%;
		transform: rotate(90deg);
		filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
	}

	.skill-orb {
		position: absolute;
		min-width: 80px;
		padding: 8px 16px;
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		transition: transform 0.1s ease-out;
	}

	.skill-name {
		color: white;
		font-size: 12px;
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(0,0,0,0.5);
		white-space: nowrap;
	}

	.bug {
		position: absolute;
		font-size: 28px;
		transform: translate(-50%, -50%);
		z-index: 50;
		filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.8));
	}

	.bullet {
		position: absolute;
		background: linear-gradient(90deg, #fbbf24, #f97316);
		border-radius: 3px;
		transform: translate(-50%, -50%);
		z-index: 45;
		box-shadow: 0 0 10px #fbbf24;
	}

	.power-up {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		transform: translate(-50%, -50%);
		z-index: 50;
		animation: powerUpFloat 1s ease-in-out infinite;
	}

	@keyframes powerUpFloat {
		0%, 100% { transform: translate(-50%, -50%) scale(1); }
		50% { transform: translate(-50%, -50%) scale(1.1); }
	}

	.ship.powered-up .ship-icon {
		filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.7)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.4));
		animation: powerGlow 1s ease-in-out infinite;
	}

	.ship.shielded .ship-icon {
		filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
	}

	@keyframes powerGlow {
		0%, 100% { filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.7)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.4)); }
		50% { filter: drop-shadow(0 0 18px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 35px rgba(168, 85, 247, 0.6)); }
	}

	.shield-bubble {
		position: absolute;
		inset: -10px;
		border: 3px solid rgba(59, 130, 246, 0.6);
		border-radius: 50%;
		animation: shieldPulse 0.5s ease-in-out infinite;
	}

	@keyframes shieldPulse {
		0%, 100% { opacity: 0.6; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.05); }
	}

	.lives-display {
		display: flex;
		justify-content: center;
		gap: 4px;
		margin-bottom: 12px;
	}

	.heart {
		font-size: 18px;
		opacity: 0.3;
		transition: opacity 0.3s;
	}

	.heart.active {
		opacity: 1;
	}

	.power-up-indicator {
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 8px;
	}

	.power-up-indicator.rapid-fire {
		background: rgba(251, 191, 36, 0.2);
		color: #fbbf24;
		animation: indicatorFlash 0.5s ease-in-out infinite;
	}

	.power-up-indicator.shield-ind {
		background: rgba(59, 130, 246, 0.2);
		color: #3b82f6;
	}

	.power-up-indicator.weapon-spread {
		background: rgba(168, 85, 247, 0.2);
		color: #a855f7;
	}

	.difficulty-display {
		text-align: center;
		font-size: 11px;
		font-weight: 600;
		color: #fbbf24;
		margin-bottom: 8px;
		padding: 4px 8px;
		background: rgba(251, 191, 36, 0.1);
		border-radius: 4px;
	}

	@keyframes indicatorFlash {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	.particle {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
		z-index: 60;
		transform: translate(-50%, -50%);
	}

	.progress-sidebar {
		position: fixed;
		top: 20px;
		right: 20px;
		background: rgba(15, 23, 42, 0.9);
		border-radius: 12px;
		padding: 16px;
		min-width: 200px;
		z-index: 200;
		border: 1px solid rgba(255,255,255,0.1);
	}

	.score-display {
		text-align: center;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(255,255,255,0.1);
	}

	.score-display .audiowide-regular {
		color: white;
		font-size: 18px;
	}

	.high-score {
		color: #94a3b8;
		font-size: 12px;
		margin-top: 4px;
	}

	.category-progress {
		margin-bottom: 10px;
	}

	.category-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		margin-bottom: 4px;
	}

	.progress-bar {
		height: 8px;
		background: rgba(255,255,255,0.1);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease-out;
	}

	.progress-count {
		font-size: 10px;
		color: #94a3b8;
		text-align: right;
		margin-top: 2px;
	}

	.completion-message {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 300;
	}

	.completion-card {
		background: rgba(15, 23, 42, 0.95);
		border: 2px solid;
		border-radius: 16px;
		padding: 24px 32px;
		text-align: center;
		max-width: 400px;
	}

	.completion-card h3 {
		font-size: 20px;
		margin-bottom: 12px;
	}

	.completion-card p {
		color: #e2e8f0;
		font-size: 14px;
		line-height: 1.5;
	}

	.controls-hint {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(15, 23, 42, 0.8);
		padding: 8px 16px;
		border-radius: 8px;
		color: #94a3b8;
		font-size: 12px;
		z-index: 200;
	}

	.menu-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.95);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.menu-content {
		text-align: center;
		color: white;
		max-width: 500px;
		padding: 40px;
	}

	.game-title {
		font-size: 48px;
		margin-bottom: 8px;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.game-subtitle {
		color: #94a3b8;
		font-size: 18px;
		margin-bottom: 32px;
	}

	.instructions {
		background: rgba(255,255,255,0.05);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 32px;
		text-align: left;
	}

	.instructions p {
		margin: 8px 0;
		color: #e2e8f0;
	}

	.highlight-skill {
		color: #3b82f6;
		font-weight: 600;
	}

	.audio-settings {
		display: flex;
		gap: 24px;
		justify-content: center;
		margin-bottom: 24px;
	}

	.audio-option {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #e2e8f0;
		font-size: 14px;
		cursor: pointer;
	}

	.audio-option input[type="checkbox"] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #3b82f6;
	}

	.menu-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
	}

	.start-button {
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		color: white;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 18px;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.start-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
	}

	.cancel-button {
		background: rgba(255,255,255,0.1);
		color: white;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 18px;
		transition: background 0.2s;
	}

	.cancel-button:hover {
		background: rgba(255,255,255,0.2);
	}

	.game-over-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 500;
	}

	.game-over-content {
		text-align: center;
		color: white;
	}

	.game-over-content h1 {
		font-size: 36px;
		margin-bottom: 16px;
	}

	.final-score {
		font-size: 24px;
		margin-bottom: 8px;
	}

	.win-message {
		color: #94a3b8;
		margin-bottom: 32px;
	}

	.game-over-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
	}

	.retry-button {
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		color: white;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		transition: transform 0.2s;
	}

	.retry-button:hover {
		transform: translateY(-2px);
	}

	.quit-button {
		background: rgba(255,255,255,0.1);
		color: white;
		padding: 16px 32px;
		border-radius: 12px;
		font-size: 16px;
		transition: background 0.2s;
	}

	.quit-button:hover {
		background: rgba(255,255,255,0.2);
	}

	.game-controls {
		position: fixed;
		top: var(--spacing-md);
		right: var(--spacing-md);
		z-index: 50;
	}

	.start-game-button {
		background: var(--color-primary);
		color: white;
		padding: var(--spacing-md);
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

	@media (max-width: 768px) {
		.progress-sidebar {
			top: 10px;
			right: 10px;
			padding: 12px;
			min-width: 150px;
		}

		.score-display .audiowide-regular {
			font-size: 14px;
		}

		.category-label {
			font-size: 9px;
		}

		.game-title {
			font-size: 32px;
		}

		.instructions {
			font-size: 14px;
		}
	}

	@media print {
		.game-controls {
			display: none;
		}
	}
</style>
