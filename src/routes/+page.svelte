<script>
	import SvelteSeo from 'svelte-seo';
  const { data } = $props();
  let profile = $state(data.profile);
  let sortedCategories = $derived([
    'programming',
    'frameworks',
    'devops',
    'databases',
    'vfx',
    'gamedev',
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
    <h2>{profile.title}</h2>
    <p>{profile.location}</p>
		<p><a href="mailto:{profile.email}">{profile.email}</a></p>
		<p><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a></p>
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
            <a href="#" class="company-link">{job.company}</a>
            <div class="experience-meta">
              <span>{job.period}</span>
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
              <p class="experience-description">{job.description}</p>
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

      <!-- Projects -->
      <section>
        <h3 class="section-title">Personal Projects</h3>
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
  margin: 12px auto;
  padding: 0 16px;
}

.resume-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start; /* Ensures content aligns at the top */
  margin-top: 16px;
}



@media (max-width: 768px) {
  .resume-grid {
    grid-template-columns: 1fr;
  }
  .sidebar {
    order: 2;
  }
  .main-content {
    order: 1;
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
  flex: 1; /* Ensures the text takes up available space */
}

.profile-image {
  width: 120px; /* Set the desired size */
  height: 120px;
  border-radius: 50%; /* Makes the image circular */
  object-fit: cover; /* Ensures the image scales without distortion */
  border: 2px solid var(--color-neutral-200); /* Optional border */
}

.header h1 {
  font-size: var(--font-size-2xl);
  margin: 0;
}

.header h2 {
  font-size: var(--font-size-xl);
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

.sidebar {
  background: white;
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  align-self: start; /* Makes the sidebar's height determined by its content */
}

.section-title {
  font-size: var(--font-size-lg);
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
  background: var(--color-neutral-100);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-700);
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

.company-link {
  color: var(--color-primary);
  text-decoration: none;
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

</style>
