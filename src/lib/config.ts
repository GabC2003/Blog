export const config = {
  site: {
    title: "Gabriel's Blog",
    name: "Gabriel's Blog",
    description: "Gabriel's Blog",
    keywords: ["Gabriel's Blog", "AI", "Full Stack Developer"],
    url: "https://xxx.com",
    baseUrl: "https://xxx.com",
    image: "https://xxx.com/og-image.png",
    favicon: {
      ico: "/favicon.ico",
      png: "/favicon.png",
      svg: "/favicon.svg",
      appleTouchIcon: "/favicon.png",
    },
    manifest: "/site.webmanifest",
    rss: {
      title: "Gabriel's Blog",
      description: "Thoughts on Full-stack development, AI",
      feedLinks: {
        rss2: "/rss.xml",
        json: "/feed.json",
        atom: "/atom.xml",
      },
    },
  },
  author: {
    name: "Gabriel",
    email: "gabrielchen0310@gmail.com",
    bio: "欢迎来到我的主页，会在这里分享一些最近在学习/感兴趣的知识",
  },
  social: {
    github: "https://github.com/GabC2003"
  },
  giscus: {
    repo: "guangzhengli/hugo-ladder-exampleSite",
    repoId: "R_kgDOHyVOjg",
    categoryId: "DIC_kwDOHyVOjs4CQsH7",
  },
  navigation: {
    main: [
      {
        title: "文章",
        href: "/blog",
      },
      {
        title: "关于",
        href: "/about",
      },
    ],
  },
  seo: {
    metadataBase: new URL("https://xxx.com"),
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: "website" as const,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image" as const,
      creator: "@xxx",
    },
  },
};
