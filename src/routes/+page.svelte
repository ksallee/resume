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

  const catClass = (category) =>
    'cat-' + category.toLowerCase().replace(/[\s\/]/g, '-');

  // Reverse lookup: skill/tech name -> category class
  let skillToCategory = $derived(() => {
    const map = {};
    for (const category of sortedCategories) {
      const cls = catClass(category);
      for (const skill of profile.skills[category] || []) {
        map[skill.toLowerCase()] = cls;
      }
    }
    return map;
  });

  const techClass = (tech) => {
    const map = skillToCategory();
    return map[tech.toLowerCase()] || '';
  };
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
      <p class="header-location">{profile.location}</p>
      <p><a href="mailto:{profile.email}">{profile.email}</a></p>
      <p class="header-links">
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
                  <span class="skill-tag {catClass(category)}">{skill}</span>
                {/each}
              </div>
            </div>
          {/each}
        </section>
      </div>

      <!-- Projects -->
      <section>
        <h3 class="section-title">Personal Projects / Volunteering</h3>
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
                <span class="skill-tag {techClass(tech)}">{tech}</span>
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
                <span class="skill-tag {catClass(category)}">{skill}</span>
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
    margin: 36px auto;
    padding: 0 20px;
  }

  .resume-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    align-items: start;
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .resume-grid {
      grid-template-columns: 1fr;
    }

    .main-content {
      order: 1;
    }

    .sidebar {
      order: 3;
    }

    .mobile-skills {
      order: 2;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(28, 25, 23, 0.06);
    }
  }

  .mobile-skills {
    display: none;
  }

  @media (max-width: 768px) {
    .mobile-skills {
      display: block;
    }

    .sidebar .skills-section {
      display: none;
    }
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: left;
    width: 100%;
  }

  .header-text {
    flex: 1;
  }

  .profile-image {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--color-neutral-200);
    box-shadow: 0 2px 12px rgba(28, 25, 23, 0.08);
  }

  .header h1 {
    font-family: var(--font-family-display);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    color: var(--color-neutral-900);
  }

  .header h2 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    line-height: 1.3;
    color: var(--color-neutral-600);
    margin: 6px 0;
  }

  .header p {
    color: var(--color-neutral-500);
    margin: 4px 0;
  }

  .header a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .header a:hover {
    color: var(--color-accent);
  }

  .header-links {
    display: flex;
    gap: 12px;
  }

  .header-links a {
    font-weight: var(--font-weight-medium);
    border-bottom: 1px solid var(--color-primary-light);
    padding-bottom: 1px;
  }

  .header-links a:hover {
    border-color: var(--color-accent);
  }

  /* ── Cards ── */
  .main-content {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(28, 25, 23, 0.06);
  }

  .main-content section {
    margin-bottom: 28px;
  }

  .main-content section:last-child {
    margin-bottom: 0;
  }

  .sidebar {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(28, 25, 23, 0.06);
    align-self: start;
  }

  /* ── Section Titles ── */
  .section-title {
    font-family: var(--font-family-display);
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--color-neutral-900);
    margin: 0 0 14px 0;
    padding-bottom: 6px;
    border-bottom: 2px solid var(--color-accent);
  }

  /* ── Skills ── */
  .skill-section {
    margin-bottom: 16px;
    page-break-inside: avoid;
  }

  .skill-category {
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-600);
    margin: 12px 0 6px 0;
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 8px;
  }

  .skill-tag {
    background: var(--color-neutral-100);
    padding: 3px 10px;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-700);
    border: 1px solid var(--color-neutral-200);
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .skill-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(28, 25, 23, 0.08);
  }

  /* Category-colored skill tags (dynamic classes from catClass()) */
  .skill-tag:global(.cat-programming) {
    background: rgba(37, 99, 235, 0.08);
    color: #1d4ed8;
    border-color: rgba(37, 99, 235, 0.2);
  }
  .skill-tag:global(.cat-frameworks) {
    background: rgba(124, 58, 237, 0.08);
    color: #6d28d9;
    border-color: rgba(124, 58, 237, 0.2);
  }
  .skill-tag:global(.cat-artificial-intelligence) {
    background: rgba(219, 39, 119, 0.08);
    color: #be185d;
    border-color: rgba(219, 39, 119, 0.2);
  }
  .skill-tag:global(.cat-devops) {
    background: rgba(234, 88, 12, 0.08);
    color: #c2410c;
    border-color: rgba(234, 88, 12, 0.2);
  }
  .skill-tag:global(.cat-databases) {
    background: rgba(13, 148, 136, 0.08);
    color: #0f766e;
    border-color: rgba(13, 148, 136, 0.2);
  }
  .skill-tag:global(.cat-vfx) {
    background: rgba(202, 138, 4, 0.08);
    color: #a16207;
    border-color: rgba(202, 138, 4, 0.2);
  }
  .skill-tag:global(.cat-game-dev) {
    background: rgba(22, 163, 74, 0.08);
    color: #15803d;
    border-color: rgba(22, 163, 74, 0.2);
  }
  .skill-tag:global(.cat-methodologies) {
    background: rgba(79, 70, 229, 0.08);
    color: #4338ca;
    border-color: rgba(79, 70, 229, 0.2);
  }

  /* ── Experience ── */
  .experience-item {
    padding: 14px 0;
    border-bottom: 1px solid rgba(28, 25, 23, 0.08);
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
    color: var(--color-neutral-500);
    font-size: var(--font-size-sm);
    margin: 4px 0;
  }

  .experience-description {
    margin: 8px 0;
    font-size: var(--font-size-base);
    color: var(--color-neutral-600);
  }

  .location {
    color: var(--color-neutral-400);
  }

  .degree {
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    margin: 4px 0;
  }

  /* ── Languages ── */
  .language-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(28, 25, 23, 0.08);
  }

  .language-item:last-child {
    border-bottom: none;
  }

  .language-level {
    color: var(--color-neutral-500);
    font-size: var(--font-size-sm);
  }

  /* ── Projects ── */
  .project-item {
    padding: 14px 0;
    border-bottom: 1px solid rgba(28, 25, 23, 0.08);
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--color-primary-light);
    padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
  }

  .project-title::after {
    content: '\2197';
    font-size: 0.85em;
    opacity: 0.5;
    transition: opacity 0.2s, transform 0.2s;
  }

  .project-title:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .project-title:hover::after {
    opacity: 1;
    transform: translate(1px, -1px);
  }

  .project-description {
    margin: 8px 0;
    color: var(--color-neutral-600);
    font-size: var(--font-size-base);
  }

  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 8px;
  }

  .projects-reason {
    font-size: var(--font-size-base);
    color: var(--color-neutral-600);
    font-style: italic;
    border-left: 3px solid var(--color-accent);
    padding: 10px 14px;
    margin-bottom: 14px;
    background: var(--color-accent-light);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  @media (max-width: 768px) {
    .skills-game-desktop {
      display: none;
    }
  }

  /* ── Print ── */
  @media print {
    .skills-game-desktop {
      display: none;
    }

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
      border: none;
      padding: 0;
    }

    .main-content section {
      margin-bottom: 16px;
    }

    .sidebar .skills-section {
      display: block !important;
    }

    .mobile-skills {
      display: none !important;
    }

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
      box-shadow: none;
    }

    .section-title {
      font-size: 0.875rem;
      margin: 0 0 6px 0;
      padding-bottom: 2px;
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
      font-size: 0.6875rem;
      padding: 1px 6px;
      border: none;
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
      background: #fef3c7;
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

    .header h2 {
      color: var(--color-neutral-600);
    }
  }
</style>
