// src/lib/blogNav.ts
// When "News & Insights" joins the navbar. The root layout counts the live posts
// (PUBLISHED_POSTS_COUNT_QUERY: a slug and a publish date that has come) and
// passes the answer to the navbar as showBlog. One post is enough, the same rule
// that lists /blog in search and the sitemap and gives the home page its search box.

/** Live posts needed before the navbar links to the blog. */
export const BLOG_NAV_MIN_POSTS = 1;

export function showsBlogLink(livePosts: number): boolean {
  return livePosts >= BLOG_NAV_MIN_POSTS;
}
