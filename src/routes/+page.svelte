<script>
	import SkillsGame from '$lib/components/SkillsGame.svelte';
	const { data } = $props();
	let profile = $state(data.profile);
	let sortedCategories = $derived([
		'programming',
		'frameworks',
		'Artificial Intelligence',
		'devops',
		'databases',
		'vfx',
		'Game Dev',
		'methodologies'
	]);
</script>

<svelte:head>
	<title>{profile.name} - Resume</title>
	<meta name="description" content="{profile.summary}" />
	<meta name="author" content="{profile.name}" />
	<meta name="image" content="{profile.picture}" />
</svelte:head>

<div class="resume-container">
	<header class="header">
		<img src="/me.jpg" alt="{profile.name}'s photo" class="profile-image" />
		<div class="header-text">
			<h1>{profile.name}</h1>
			<h2>{@html profile.title}</h2>
			<p>{profile.location}</p>
			<p><a href="mailto:{profile.email}">{profile.email}</a></p>
			<p>
				<a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
			</p>
		</div>
		<div class="skills-game-desktop">
			<SkillsGame skills={profile.skills} />
		</div>
	</header>

	<div class="resume-grid">
		<main class="main-content">
			<!-- Summary -->
			<section>
				<h3 class="section-title">Summary</h3>
				<p>{@html profile.summary}</p>
			</section>

			<!-- Experience -->
			<section>
				<h3 class="section-title">Experience</h3>
				{#each profile.experience as job}
					<div class="experience-item">
						<h4 class="experience-title">{job.title}</h4>
						<span class="company-name">{job.company}</span>
						<div class="experience-meta">
							<span><b>{job.period}</b></span>
							{#if job.duration}
								<span>·</span>
								<span>{job.duration}</span>
							{/if}
							{#if job.location}
								<span>·</span>
								<span class="location">{job.location}</span>
							{/if}
						</div>
						{#if job.description}
							<p class="experience-description">{@html job.description}</p>
						{/if}
						{#if job.skills}
							<div class="skills-list">
								{#each job.skills as skill}
									<span class="skill-tag">{skill}</span>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</section>
			<!-- Mobile-only skills section -->
		<div class="mobile-skills">
			<section>
				<h3 class="section-title">Skills</h3>
				{#each sortedCategories as category}
					<div class="skill-section">
						<h4 class="skill-category">{category}</h4>
						<div class="skills-list">
							{#each profile.skills[category] as skill}
								<span class="skill-tag">{skill}</span>
							{/each}
						</div>
					</div>
				{/each}
			</section>
		</div>

			<!-- Projects -->
			<section>
				<h3 class="section-title">Personal Projects / Volunteering </h3>
				<div class="projects-reason">
					{@html profile.projects_reason}
				</div>
				{#each profile.projects as project}
					<div class="project-item">
						<div class="project-header">
							<a href={project.url} target="_blank" rel="noopener noreferrer" class="project-title">
								{project.title}
							</a>
						</div>
						<p class="project-description">{project.description}</p>
						<div class="project-tech">
							{#each project.tech as tech}
								<span class="skill-tag">{tech}</span>
							{/each}
						</div>
					</div>
				{/each}
			</section>

			<!-- Education -->
			<section>
				<h3 class="section-title">Education</h3>
				{#each profile.education as edu}
					<div class="experience-item">
						<h4 class="experience-title">{edu.school}</h4>
						{#if edu.degree}
							<div class="degree">{edu.degree}</div>
						{/if}
						<div class="experience-meta">{edu.period}</div>
						<p class="experience-description">{edu.description}</p>
					</div>
				{/each}
			</section>
		</main>

		<aside class="sidebar">
			<!-- Skills -->
			<section class="skills-section">
				<h3 class="section-title">Skills</h3>
				{#each sortedCategories as category}
					<div class="skill-section">
						<h4 class="skill-category">{category}</h4>
						<div class="skills-list">
							{#each profile.skills[category] as skill}
								<span class="skill-tag">{skill}</span>
							{/each}
						</div>
					</div>
				{/each}
			</section>

			<!-- Languages -->
			<section>
				<h3 class="section-title">Languages</h3>
				{#each profile.languages as lang}
					<div class="language-item">
						<strong>{lang.name}</strong>
						<span class="language-level">{lang.level}</span>
					</div>
				{/each}
			</section>
		</aside>
	</div>
</div>

<style>
	.resume-container {
		max-width: 1200px;
		margin: 28px auto;
		padding: 0 16px;
	}

	.resume-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 16px;
		align-items: start;
		margin-top: 16px;
	}

	@media (max-width: 768px) {
		.resume-grid {
			grid-template-columns: 1fr;
		}

		/* Reorder sections in mobile */
		.main-content {
			order: 1;
		}

		.sidebar {
			order: 3; /* Change from 2 to 3 */
		}

		/* Create a new container for skills in mobile */
		.mobile-skills {
			order: 2;
			background: white;
			border-radius: var(--radius-lg);
			box-shadow: var(--shadow-sm);
		}
	}

	/* Hide/show mobile skills based on viewport */
	.mobile-skills {
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-skills {
			display: block;
		}

		/* Hide the skills in sidebar on mobile */
		.sidebar .skills-section {
			display: none;
		}
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		text-align: left;
		width: 100%;
	}

	.header-text {
		flex: 1;
	}

	.profile-image {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-neutral-200);
	}

	.header h1 {
		font-size: var(--font-size-2xl);
		line-height: 1.2;
		margin: 0;
	}

	.header h2 {
		font-size: var(--font-size-xl);
		line-height: 1.3;
		color: var(--color-primary);
		margin: 4px 0;
	}

	.header p {
		color: var(--color-neutral-600);
		margin: 4px 0;
	}

	.main-content {
		background: white;
		border-radius: var(--radius-lg);
		padding: 16px;
		box-shadow: var(--shadow-sm);
	}

	.main-content section {
		margin-bottom: 24px;
	}

	.main-content section:last-child {
		margin-bottom: 0;
	}

	.sidebar {
		background: white;
		border-radius: var(--radius-lg);
		padding: 16px;
		box-shadow: var(--shadow-sm);
		align-self: start;
	}

	.section-title {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-neutral-900);
		margin: 0 0 12px 0;
		padding-bottom: 4px;
		border-bottom: 2px solid var(--color-primary);
	}

	.skill-section {
		margin-bottom: 16px;
		page-break-inside: avoid;
	}

	.skill-category {
		font-weight: var(--font-weight-semibold);
		color: var(--color-neutral-700);
		margin: 12px 0 4px 0;
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 8px;
	}

	.skill-tag {
		background: var(--color-neutral-200);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--color-neutral-800);
	}

	.experience-item {
		padding: 12px 0;
		border-bottom: 1px solid var(--color-neutral-200);
		page-break-inside: avoid;
	}

	.experience-item:last-child {
		border-bottom: none;
	}

	.experience-title {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		margin: 0;
		color: var(--color-neutral-900);
	}

	.company-name {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-base);
	}

	.experience-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-neutral-600);
		font-size: var(--font-size-sm);
		margin: 4px 0;
	}

	.experience-description {
		margin: 8px 0;
		font-size: var(--font-size-base);
		color: var(--color-neutral-700);
	}

	.location {
		color: var(--color-neutral-500);
	}

	.degree {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
		margin: 4px 0;
	}

	.language-item {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.language-item:last-child {
		border-bottom: none;
	}

	.language-level {
		color: var(--color-neutral-600);
		font-size: var(--font-size-sm);
	}

	.project-item {
		padding: 12px 0;
		border-bottom: 1px solid var(--color-neutral-200);
		page-break-inside: avoid;
	}

	.project-item:last-child {
		border-bottom: none;
	}

	.project-title {
		color: var(--color-primary);
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-lg);
		text-decoration: none;
		display: block;
		margin-bottom: 4px;
	}

	.project-description {
		margin: 8px 0;
		color: var(--color-neutral-700);
		font-size: var(--font-size-base);
	}

	.project-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 8px;
	}
	.projects-reason {
		font-size: var(--font-size-base);
		color: var(--color-neutral-600);
		font-style: italic;
		border-left: 3px solid var(--color-primary-light);
		padding: 8px 12px;
		margin-bottom: 12px;
		background: var(--color-neutral-50);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	@media (max-width: 768px) {
		.skills-game-desktop {
			display: none;
		}
	}

	@media print {
		.skills-game-desktop {
			display: none;
		}

		/* Layout */
		.resume-container {
			margin: 0;
			padding: 0;
			background: #fff;
		}

		.resume-grid {
			display: block;
		}

		.main-content,
		.sidebar {
			background: none;
			box-shadow: none;
			padding: 0;
		}

		.main-content section {
			margin-bottom: 16px;
		}

		/* Skills: show sidebar skills, hide mobile duplicate */
		.sidebar .skills-section {
			display: block !important;
		}

		.mobile-skills {
			display: none !important;
		}

		/* Typography — tighten for print */
		.header {
			margin-bottom: 12px;
			gap: 12px;
		}

		.header h1 {
			font-size: 1.1875rem;
		}

		.header h2 {
			font-size: 0.9375rem;
			margin: 2px 0;
		}

		.header p {
			margin: 2px 0;
			font-size: 0.75rem;
		}

		.profile-image {
			width: 76px;
			height: 76px;
		}

		.section-title {
			font-size: 0.875rem;
			margin: 0 0 6px 0;
			padding-bottom: 2px;
			border-bottom-color: #1e40af;
			page-break-after: avoid;
		}

		.experience-item,
		.project-item {
			padding: 8px 0;
		}

		.experience-title {
			font-size: 0.875rem;
		}

		.experience-meta {
			font-size: 0.6875rem;
			margin: 2px 0;
		}

		.experience-description {
			margin: 4px 0;
			font-size: 0.8125rem;
		}

		.company-name {
			font-size: 0.8125rem;
		}

		.skill-category {
			font-size: 0.6875rem;
			margin: 6px 0 2px 0;
		}

		.skill-tag {
			background: #e5e7eb;
			color: #111;
			font-size: 0.6875rem;
			padding: 1px 6px;
		}

		.skill-section {
			margin-bottom: 8px;
		}

		.skills-list {
			gap: 3px;
			margin-bottom: 4px;
		}

		.project-title {
			font-size: 0.8125rem;
		}

		.project-description {
			font-size: 0.75rem;
			margin: 4px 0;
		}

		.projects-reason {
			border-left-color: #1e40af;
			background: #f9fafb;
			font-size: 0.75rem;
			padding: 4px 8px;
			margin-bottom: 6px;
			page-break-after: avoid;
		}

		.degree {
			font-size: 0.8125rem;
			margin: 2px 0;
		}

		.language-item {
			padding: 4px 0;
			font-size: 0.8125rem;
		}

		.skill-category {
			font-size: 0.6875rem;
			margin: 6px 0 2px 0;
		}

		/* Colors */
		.header h2,
		.company-name,
		.degree,
		.project-title {
			color: #1e40af;
		}
	}
</style>