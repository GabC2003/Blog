import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

const POSTS_PER_PAGE = 5;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const sortedBlogs = allBlogs.sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(sortedBlogs.length / POSTS_PER_PAGE);
  const blogs = sortedBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-12">
        {/* Intro Section */}
        <section className="pb-10 border-b border-slate-100 mb-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Blog
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              {config.author.bio}
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group"
          >
            <span>更多关于我</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        <div className="space-y-8">
          {blogs.map((blog: any) => (
            <article key={blog.slug} className="group">
              <Link href={`/blog/${blog.slug}`}>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors underline underline-offset-4 decoration-current">
                        {blog.title}
                      </h2>
                      {blog.keywords && blog.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {blog.keywords.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap pt-1">
                      {formatDate(blog.date)} · {count(blog.content)} 字
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed text-justify">
                    {blog.summary}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center space-x-2 pt-8 border-t border-gray-100">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                上一页
              </Link>
            )}

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                下一页
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
