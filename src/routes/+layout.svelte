<script>
  import '../app.css';
	import SvelteSeo from 'svelte-seo';
</script>
	<title>Kevin Sallee - Resume</title>
	<SvelteSeo
  openGraph={{
    title: "Kevin Sallee - Resume",
    description: "Explore Kevin Sallee's professional resume, showcasing skills, experience, projects, and more.",
    keywords: "Kevin Sallee, Resume, Software Developer, Projects, Experience, Skills, Portfolio",
    canonical: "https://kevinsallee.netlify.app/",
    url: "https://kevinsallee.netlify.app/",
    type: "website",
    images: [
      {
        url: "https://kevinsallee.netlify.app/me.jpg",
        width: 928,
        height: 1232,
        alt: "Kevin Sallee Profile Picture"
      }
    ]
  }}
/>
<slot />