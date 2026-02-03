import { x as ensure_array_like, y as attr, z as stringify, F as head, G as slot } from "../../chunks/index.js";
import { k as escape_html } from "../../chunks/context.js";
import { h as html } from "../../chunks/html.js";
function Open_graph($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { openGraph } = $$props;
    if (openGraph) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Object.entries(openGraph));
      for (let $$index_13 = 0, $$length = each_array.length; $$index_13 < $$length; $$index_13++) {
        let [key, value] = each_array[$$index_13];
        const _type = typeof value;
        if (_type !== "object") {
          $$renderer2.push("<!--[-->");
          const transform = key.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
          $$renderer2.push(`<meta${attr("property", `og:${stringify(transform)}`)}${attr("content", value)}/>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (_type === "object") {
          $$renderer2.push("<!--[-->");
          if (key === "images") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(openGraph.images ?? []);
            for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
              let image = each_array_1[$$index_1];
              $$renderer2.push(`<!--[-->`);
              const each_array_2 = ensure_array_like(Object.entries(image));
              for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
                let [key2, value2] = each_array_2[$$index];
                $$renderer2.push(`<meta${attr("property", `og:image:${stringify(key2)}`)}${attr("content", value2.toString())}/>`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (key === "videos") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<!--[-->`);
              const each_array_3 = ensure_array_like(openGraph.videos ?? []);
              for (let $$index_3 = 0, $$length2 = each_array_3.length; $$index_3 < $$length2; $$index_3++) {
                let video = each_array_3[$$index_3];
                $$renderer2.push(`<!--[-->`);
                const each_array_4 = ensure_array_like(Object.entries(video));
                for (let $$index_2 = 0, $$length3 = each_array_4.length; $$index_2 < $$length3; $$index_2++) {
                  let [key2, value2] = each_array_4[$$index_2];
                  if (key2 === "url") {
                    $$renderer2.push("<!--[-->");
                    $$renderer2.push(`<meta property="og:video"${attr("content", value2.toString())}/>`);
                  } else {
                    $$renderer2.push("<!--[!-->");
                    $$renderer2.push(`<meta${attr("property", `og:video:${stringify(key2)}`)}${attr("content", value2.toString())}/>`);
                  }
                  $$renderer2.push(`<!--]-->`);
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (key === "localeAlternate") {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<!--[-->`);
                const each_array_5 = ensure_array_like(openGraph.localeAlternate ?? []);
                for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
                  let alternate = each_array_5[$$index_4];
                  $$renderer2.push(`<meta property="og:locale:alternate"${attr("content", alternate)}/>`);
                }
                $$renderer2.push(`<!--]-->`);
              } else {
                $$renderer2.push("<!--[!-->");
                if (key === "music") {
                  $$renderer2.push("<!--[-->");
                  $$renderer2.push(`<!--[-->`);
                  const each_array_6 = ensure_array_like(Object.entries(openGraph.music ?? {}));
                  for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
                    let [key2, value2] = each_array_6[$$index_5];
                    const transform = key2.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
                    $$renderer2.push(`<meta${attr("property", `music:${stringify(transform)}`)}${attr("content", value2.toString())}/>`);
                  }
                  $$renderer2.push(`<!--]-->`);
                } else {
                  $$renderer2.push("<!--[!-->");
                  if (key === "movie") {
                    $$renderer2.push("<!--[-->");
                    $$renderer2.push(`<!--[-->`);
                    const each_array_7 = ensure_array_like(Object.entries(openGraph.movie ?? {}));
                    for (let $$index_7 = 0, $$length2 = each_array_7.length; $$index_7 < $$length2; $$index_7++) {
                      let [key2, value2] = each_array_7[$$index_7];
                      if (typeof value2 === "object") {
                        $$renderer2.push("<!--[-->");
                        $$renderer2.push(`<!--[-->`);
                        const each_array_8 = ensure_array_like(value2);
                        for (let $$index_6 = 0, $$length3 = each_array_8.length; $$index_6 < $$length3; $$index_6++) {
                          let propValue = each_array_8[$$index_6];
                          $$renderer2.push(`<meta${attr("property", `video:${stringify(key2)}`)}${attr("content", propValue)}/>`);
                        }
                        $$renderer2.push(`<!--]-->`);
                      } else {
                        $$renderer2.push("<!--[!-->");
                        const transform = key2.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
                        $$renderer2.push(`<meta${attr("property", `video:${stringify(transform)}`)}${attr("content", value2.toString())}/>`);
                      }
                      $$renderer2.push(`<!--]-->`);
                    }
                    $$renderer2.push(`<!--]-->`);
                  } else {
                    $$renderer2.push("<!--[!-->");
                    if (key === "article") {
                      $$renderer2.push("<!--[-->");
                      $$renderer2.push(`<!--[-->`);
                      const each_array_9 = ensure_array_like(Object.entries(openGraph.article ?? {}));
                      for (let $$index_9 = 0, $$length2 = each_array_9.length; $$index_9 < $$length2; $$index_9++) {
                        let [key2, value2] = each_array_9[$$index_9];
                        if (typeof value2 === "object") {
                          $$renderer2.push("<!--[-->");
                          $$renderer2.push(`<!--[-->`);
                          const each_array_10 = ensure_array_like(value2);
                          for (let $$index_8 = 0, $$length3 = each_array_10.length; $$index_8 < $$length3; $$index_8++) {
                            let propValue = each_array_10[$$index_8];
                            $$renderer2.push(`<meta${attr("property", `article:${stringify(key2)}`)}${attr("content", propValue)}/>`);
                          }
                          $$renderer2.push(`<!--]-->`);
                        } else {
                          $$renderer2.push("<!--[!-->");
                          const transform = key2.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
                          $$renderer2.push(`<meta${attr("property", `article:${stringify(transform)}`)}${attr("content", value2.toString())}/>`);
                        }
                        $$renderer2.push(`<!--]-->`);
                      }
                      $$renderer2.push(`<!--]-->`);
                    } else {
                      $$renderer2.push("<!--[!-->");
                      if (key === "book") {
                        $$renderer2.push("<!--[-->");
                        $$renderer2.push(`<!--[-->`);
                        const each_array_11 = ensure_array_like(Object.entries(openGraph.book ?? {}));
                        for (let $$index_11 = 0, $$length2 = each_array_11.length; $$index_11 < $$length2; $$index_11++) {
                          let [key2, value2] = each_array_11[$$index_11];
                          if (typeof value2 === "object") {
                            $$renderer2.push("<!--[-->");
                            $$renderer2.push(`<!--[-->`);
                            const each_array_12 = ensure_array_like(value2);
                            for (let $$index_10 = 0, $$length3 = each_array_12.length; $$index_10 < $$length3; $$index_10++) {
                              let propValue = each_array_12[$$index_10];
                              $$renderer2.push(`<meta${attr("property", `book:${stringify(key2)}`)}${attr("content", propValue)}/>`);
                            }
                            $$renderer2.push(`<!--]-->`);
                          } else {
                            $$renderer2.push("<!--[!-->");
                            const transform = key2.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
                            $$renderer2.push(`<meta${attr("property", `book:${stringify(transform)}`)}${attr("content", value2.toString())}/>`);
                          }
                          $$renderer2.push(`<!--]-->`);
                        }
                        $$renderer2.push(`<!--]-->`);
                      } else {
                        $$renderer2.push("<!--[!-->");
                        if (key === "profile") {
                          $$renderer2.push("<!--[-->");
                          $$renderer2.push(`<!--[-->`);
                          const each_array_13 = ensure_array_like(Object.entries(openGraph.profile ?? {}));
                          for (let $$index_12 = 0, $$length2 = each_array_13.length; $$index_12 < $$length2; $$index_12++) {
                            let [key2, value2] = each_array_13[$$index_12];
                            const transform = key2.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
                            $$renderer2.push(`<meta${attr("property", `profile:${stringify(transform)}`)}${attr("content", value2)}/>`);
                          }
                          $$renderer2.push(`<!--]-->`);
                        } else {
                          $$renderer2.push("<!--[!-->");
                        }
                        $$renderer2.push(`<!--]-->`);
                      }
                      $$renderer2.push(`<!--]-->`);
                    }
                    $$renderer2.push(`<!--]-->`);
                  }
                  $$renderer2.push(`<!--]-->`);
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Dist($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      title,
      description,
      keywords,
      base,
      applicationName,
      themeColor,
      nofollow,
      noindex,
      canonical,
      openGraph,
      amp,
      languageAlternates,
      facebook,
      manifest,
      twitter,
      nositelinkssearchbox,
      notranslate,
      jsonLd,
      children
    } = $$props;
    head("1grlwww", $$renderer2, ($$renderer3) => {
      if (title) {
        $$renderer3.push("<!--[-->");
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>${escape_html(title)}</title>`);
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (description) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="description"${attr("content", description)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (canonical) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<link rel="canonical"${attr("href", canonical)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (keywords) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="keywords"${attr("content", keywords)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (amp) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<link rel="amphtml"${attr("href", amp)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (manifest) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<link rel="manifest"${attr("href", manifest)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (applicationName) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="application-name"${attr("content", applicationName)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (languageAlternates) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(languageAlternates);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let { href, hreflang } = each_array[$$index];
          $$renderer3.push(`<link rel="alternate"${attr("href", href)}${attr("hreflang", hreflang)}/>`);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (themeColor) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="theme-color"${attr("content", themeColor)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (base) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<base${attr("href", base)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (facebook?.appId) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta property="fb:app_id"${attr("content", facebook.appId)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <meta name="robots"${attr("content", `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`)}/> <meta name="googlebot"${attr("content", `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`)}/> `);
      if (nositelinkssearchbox) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="google" content="nositelinkssearchbox"/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (notranslate) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<meta name="google" content="notranslate"/>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (twitter) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(Object.entries(twitter));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let [key, value] = each_array_1[$$index_1];
          const transformed = key.replace(/([a-z])([A-Z])/g, "$1:$2").toLowerCase();
          $$renderer3.push(`<meta${attr("name", `twitter:${stringify(transformed)}`)}${attr("content", value)}/>`);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (openGraph) {
        $$renderer3.push("<!--[-->");
        Open_graph($$renderer3, { openGraph });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (jsonLd) {
        $$renderer3.push("<!--[-->");
        const data = Object.assign({ "@context": "https://schema.org" }, jsonLd);
        $$renderer3.push(`${html(`<script type="application/ld+json">${JSON.stringify(data) + "<"}/script>`)}`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      children?.($$renderer3);
      $$renderer3.push(`<!---->`);
    });
  });
}
function _layout($$renderer, $$props) {
  $$renderer.push(`<title>Kevin Sallee - Resume</title> `);
  Dist($$renderer, {
    openGraph: {
      title: "Kevin Sallee - Resume",
      description: "Explore Kevin Sallee's professional resume, showcasing skills, experience, projects, and more.",
      keywords: "Kevin Sallee, Resume, Software Developer, Projects, Experience, Skills, Portfolio",
      canonical: "https://kevinsallee.vercel.app/",
      url: "https://kevinsallee.vercel.app/",
      type: "website",
      images: [
        {
          url: "https://kevinsallee.vercel.app/me.jpg",
          width: 928,
          height: 1232,
          alt: "Kevin Sallee Profile Picture"
        }
      ]
    }
  });
  $$renderer.push(`<!----> <!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]-->`);
}
export {
  _layout as default
};
