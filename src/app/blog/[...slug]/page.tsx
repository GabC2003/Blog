import { allBlogs } from "content-collections"
import type { Metadata } from "next"
import Link from "next/link"
import { absoluteUrl, formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import count from 'word-count'
import { components } from "@/components/mdx-components"
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.min.css'
import GiscusComments from "@/components/giscus-comments"
import 'katex/dist/katex.min.css';
import { config } from "@/lib/config";

type BlogsPageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeHighlight,
      rehypeSlug
    ],
  }
}

async function getBlogsFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || ""
  const blog = allBlogs.find((blog: any) => blog.slug === slug)

  if (!blog) {
    return null
  }

  return blog as unknown as { slug: string; title: string; content: string; date: string; keywords?: string[] }
}

export async function generateMetadata({ params }: BlogsPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogsFromParams(slug)

  if (!blog) {
    return {}
  }

  return {
    title: blog.title,
    description: blog.title,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.title,
      type: config.seo.openGraph.type,
      url: absoluteUrl("/" + blog.slug),
      images: [
        {
          url: config.site.image
        },
      ],
    },
    twitter: {
      card: config.seo.twitter.card,
      title: blog.title,
      description: blog.title,
      images: [
        {
          url: config.site.image
        },
      ],
      creator: config.seo.twitter.creator,
    },
  }
}

export async function generateStaticParams(): Promise<string[]> {
  // @ts-ignore
  return allBlogs.map((blog: any) => ({
    slug: blog.slug.split('/'),
  }))
}

export default async function BlogPage(props: BlogsPageProps) {
  const { slug } = await props.params;
  const blog = await getBlogsFromParams(slug)

  if (!blog) {
    notFound()
  }

  return (
    <main className="relative py-4 max-w-5xl mx-auto">
      <div className="w-full px-2">
        {/* Back link */}
        <Link 
          href="/blog"
          className="text-[#828282] text-sm hover:underline mb-4 inline-block"
        >
          &lt; back to blogs
        </Link>

        <div className="mb-4">
          <h1 className="text-xl font-medium text-black">{blog.title}</h1>
        </div>

        <div className="mb-6 text-[#828282] text-xs">
          <span>{formatDate(blog.date)}</span>
          <span className="mx-1">·</span>
          <span>{count(blog.content)} 字</span>
          {blog.keywords && blog.keywords.length > 0 && (
            <>
              <span className="mx-1">·</span>
              <span>{blog.keywords.join(', ')}</span>
            </>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <MDXRemote source={blog.content} components={components} options={options} />
        </div>

        <div className="mt-8 pt-4 border-t border-[#e5e5e5]">
          <GiscusComments />
        </div>
      </div>
    </main>
  );
}
