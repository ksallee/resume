// Pre-tested layout presets — the AI picks by name, we resolve to CSS values
export const LAYOUT_PRESETS = {
  'classic-right': {
    columns: '1fr 340px',
    template: '"summary skills" "experience skills" "experience languages" "projects education"',
  },
  'classic-narrow': {
    columns: '1fr 280px',
    template: '"summary skills" "experience skills" "projects skills" "education languages"',
  },
  'classic-compact': {
    columns: '1fr 300px',
    template: '"summary skills" "experience skills" "experience languages" "projects education"',
  },
  'sidebar-left': {
    columns: '320px 1fr',
    template: '"skills summary" "skills experience" "skills projects" "languages education"',
  },
  'sidebar-left-alt': {
    columns: '300px 1fr',
    template: '"summary experience" "skills experience" "skills projects" "languages education"',
  },
  'bento': {
    columns: '1fr 1fr',
    template: '"summary summary" "experience skills" "projects skills" "education languages"',
  },
  'bento-alt': {
    columns: '1fr 1fr',
    template: '"summary summary" "experience skills" "experience languages" "projects education"',
  },
  'bento-skills-left': {
    columns: '1fr 1fr',
    template: '"summary summary" "skills experience" "languages experience" "education projects"',
  },
  'experience-focus': {
    columns: '1fr 300px',
    template: '"experience summary" "experience skills" "experience languages" "projects education"',
  },
  'experience-focus-alt': {
    columns: '1fr 1fr',
    template: '"experience summary" "experience skills" "experience languages" "projects education"',
  },
  'equal-experience-left': {
    columns: '1fr 1fr',
    template: '"experience summary" "experience skills" "experience languages" "projects education"',
  },
  // These two have no grid-template (no split)
  'single-column': { columns: '1fr', template: null },
  'default': { columns: '1fr 300px', template: null },
};

export const resolvePreset = (presetName) => {
  return LAYOUT_PRESETS[presetName] || LAYOUT_PRESETS['default'];
};
