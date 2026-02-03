import { F as head, y as attr, z as stringify, x as ensure_array_like } from "../../chunks/index.js";
import { m as ssr_context, k as escape_html } from "../../chunks/context.js";
import { h as html } from "../../chunks/html.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function AudioManager($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    onDestroy(() => {
    });
  });
}
function SkillsGame($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentWeapon = "normal";
    shielded || currentWeapon !== "normal";
    let shielded = false;
    onDestroy(() => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
      }
    });
    AudioManager($$renderer2);
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="game-controls svelte-f3bv08"><button class="start-game-button audiowide-regular svelte-f3bv08">PLAY SKILL QUEST</button></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { data } = $$props;
    let profile = data.profile;
    let sortedCategories = [
      "programming",
      "frameworks",
      "Artificial Intelligence",
      "devops",
      "databases",
      "vfx",
      "gamedev",
      "methodologies"
    ];
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(profile.name)} - Resume</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", profile.summary)}/> <meta name="author"${attr("content", profile.name)}/> <meta name="image"${attr("content", profile.picture)}/>`);
    });
    $$renderer2.push(`<div class="resume-container svelte-1uha8ag"><header class="header svelte-1uha8ag"><img src="/me.jpg"${attr("alt", `${stringify(profile.name)}'s photo`)} class="profile-image svelte-1uha8ag"/> <div class="header-text svelte-1uha8ag"><h1 class="svelte-1uha8ag">${escape_html(profile.name)}</h1> <h2 class="svelte-1uha8ag">${html(profile.title)}</h2> <p class="svelte-1uha8ag">${escape_html(profile.location)}</p> <p class="svelte-1uha8ag"><a${attr("href", `mailto:${stringify(profile.email)}`)}>${escape_html(profile.email)}</a></p> <p class="svelte-1uha8ag"><a${attr("href", profile.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a> <a${attr("href", profile.github)} target="_blank" rel="noopener noreferrer">GitHub</a></p></div> <div class="skills-game-desktop svelte-1uha8ag">`);
    SkillsGame($$renderer2, { skills: profile.skills });
    $$renderer2.push(`<!----></div></header> <div class="resume-grid svelte-1uha8ag"><main class="main-content svelte-1uha8ag"><section><h3 class="section-title svelte-1uha8ag">Summary</h3> <p>${html(profile.summary)}</p></section> <section><h3 class="section-title svelte-1uha8ag">Experience</h3> <!--[-->`);
    const each_array = ensure_array_like(profile.experience);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let job = each_array[$$index_1];
      $$renderer2.push(`<div class="experience-item svelte-1uha8ag"><h4 class="experience-title svelte-1uha8ag">${escape_html(job.title)}</h4> <span class="company-name svelte-1uha8ag">${escape_html(job.company)}</span> <div class="experience-meta svelte-1uha8ag"><span><b>${escape_html(job.period)}</b></span> `);
      if (job.duration) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>·</span> <span>${escape_html(job.duration)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (job.location) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span>·</span> <span class="location svelte-1uha8ag">${escape_html(job.location)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (job.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="experience-description svelte-1uha8ag">${html(job.description)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (job.skills) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="skills-list svelte-1uha8ag"><!--[-->`);
        const each_array_1 = ensure_array_like(job.skills);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let skill = each_array_1[$$index];
          $$renderer2.push(`<span class="skill-tag svelte-1uha8ag">${escape_html(skill)}</span>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section> <div class="mobile-skills svelte-1uha8ag"><section><h3 class="section-title svelte-1uha8ag">Skills</h3> <!--[-->`);
    const each_array_2 = ensure_array_like(sortedCategories);
    for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
      let category = each_array_2[$$index_3];
      $$renderer2.push(`<div class="skill-section svelte-1uha8ag"><h4 class="skill-category svelte-1uha8ag">${escape_html(category)}</h4> <div class="skills-list svelte-1uha8ag"><!--[-->`);
      const each_array_3 = ensure_array_like(profile.skills[category]);
      for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
        let skill = each_array_3[$$index_2];
        $$renderer2.push(`<span class="skill-tag svelte-1uha8ag">${escape_html(skill)}</span>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></section></div> <section><h3 class="section-title svelte-1uha8ag">Personal Projects / Volunteering</h3> <div class="projects-reason">${html(profile.projects_reason)}</div> <!--[-->`);
    const each_array_4 = ensure_array_like(profile.projects);
    for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
      let project = each_array_4[$$index_5];
      $$renderer2.push(`<div class="project-item svelte-1uha8ag"><div class="project-header"><a${attr("href", project.url)} target="_blank" rel="noopener noreferrer" class="project-title svelte-1uha8ag">${escape_html(project.title)}</a></div> <p class="project-description svelte-1uha8ag">${escape_html(project.description)}</p> <div class="project-tech svelte-1uha8ag"><!--[-->`);
      const each_array_5 = ensure_array_like(project.tech);
      for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
        let tech = each_array_5[$$index_4];
        $$renderer2.push(`<span class="skill-tag svelte-1uha8ag">${escape_html(tech)}</span>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></section> <section><h3 class="section-title svelte-1uha8ag">Education</h3> <!--[-->`);
    const each_array_6 = ensure_array_like(profile.education);
    for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
      let edu = each_array_6[$$index_6];
      $$renderer2.push(`<div class="experience-item svelte-1uha8ag"><h4 class="experience-title svelte-1uha8ag">${escape_html(edu.school)}</h4> `);
      if (edu.degree) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="degree svelte-1uha8ag">${escape_html(edu.degree)}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="experience-meta svelte-1uha8ag">${escape_html(edu.period)}</div> <p class="experience-description svelte-1uha8ag">${escape_html(edu.description)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></section></main> <aside class="sidebar svelte-1uha8ag"><section class="skills-section svelte-1uha8ag"><h3 class="section-title svelte-1uha8ag">Skills</h3> <!--[-->`);
    const each_array_7 = ensure_array_like(sortedCategories);
    for (let $$index_8 = 0, $$length = each_array_7.length; $$index_8 < $$length; $$index_8++) {
      let category = each_array_7[$$index_8];
      $$renderer2.push(`<div class="skill-section svelte-1uha8ag"><h4 class="skill-category svelte-1uha8ag">${escape_html(category)}</h4> <div class="skills-list svelte-1uha8ag"><!--[-->`);
      const each_array_8 = ensure_array_like(profile.skills[category]);
      for (let $$index_7 = 0, $$length2 = each_array_8.length; $$index_7 < $$length2; $$index_7++) {
        let skill = each_array_8[$$index_7];
        $$renderer2.push(`<span class="skill-tag svelte-1uha8ag">${escape_html(skill)}</span>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></section> <section><h3 class="section-title svelte-1uha8ag">Languages</h3> <!--[-->`);
    const each_array_9 = ensure_array_like(profile.languages);
    for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
      let lang = each_array_9[$$index_9];
      $$renderer2.push(`<div class="language-item svelte-1uha8ag"><strong>${escape_html(lang.name)}</strong> <span class="language-level svelte-1uha8ag">${escape_html(lang.level)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></section></aside></div></div>`);
  });
}
export {
  _page as default
};
