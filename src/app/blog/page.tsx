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

const POSTS_PER_PAGE = 10;

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

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;

  return (
    <main className="max-w-5xl mx-auto px-2 py-2">
      <ol className="list-none" start={startIndex + 1}>
        {blogs.map((blog: any, index: number) => (
          <li key={blog.slug} className="flex items-start gap-2 py-1">
            {/* 序号 */}
            <span className="text-[#828282] text-sm w-6 text-right flex-shrink-0 pt-0.5">
              {startIndex + index + 1}.
            </span>
            
            {/* 投票三角 */}
            <span className="text-[#828282] text-xs flex-shrink-0 pt-1 cursor-pointer hover:text-[#ff6600]">
              ▲
            </span>
            
            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="text-black text-sm hover:underline visited:text-[#828282]"
                >
                  {blog.title}
                </Link>
                {blog.keywords && blog.keywords.length > 0 && (
                  <span className="text-[#828282] text-xs">
                    ({blog.keywords[0]})
                  </span>
                )}
              </div>
              <div className="text-[#828282] text-xs mt-0.5">
                {count(blog.content)} 字 · {formatDate(blog.date)} · 
                <Link href={`/blog/${blog.slug}`} className="hover:underline ml-1">
                  discuss
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Pagination - HN Style */}
      {totalPages > 1 && (
        <div className="mt-4 pl-8 flex items-center gap-2 text-sm">
          {currentPage > 1 && (
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className="text-[#828282] hover:underline"
            >
              &lt; prev
            </Link>
          )}
          <span className="text-[#828282]">
            {currentPage}/{totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className="text-[#828282] hover:underline"
            >
              more &gt;
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
