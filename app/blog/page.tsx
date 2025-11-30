import Image from "next/image";
import Link from "next/link";
import { buildBlogPosts } from "@/lib/blogPosts";
import { getAirQualityOverview } from "@/lib/airQuality";
import { getWaterQualityOverview } from "@/lib/waterQuality";

export const metadata = {
  title: "Environmental Blog | Global Air & Water Observatory",
  description:
    "Auto-generated briefings that combine live air quality and water safety data.",
};

export default async function BlogPage() {
  const [air, water] = await Promise.all([
    getAirQualityOverview(),
    getWaterQualityOverview(),
  ]);

  const posts = buildBlogPosts(air, water);

  return (
    <>
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Insight blog
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          Five quick reads on today&apos;s air and water signals
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Each card below is generated directly from the live datasets that power
          the dashboards. Use them in weekly city briefings or send the link to
          colleagues who need the highlights without crunching raw numbers.
        </p>
      </section>

      {posts.map((post) => (
        <section key={post.id}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src={post.hero}
                alt={post.title}
                width={800}
                height={480}
                className="h-full w-full rounded-3xl object-cover"
                unoptimized
              />
              <p className="mt-2 text-xs text-slate-500">
                {post.credit}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Data story
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="mt-2 block text-3xl font-semibold text-slate-900 transition hover:text-slate-600"
              >
                {post.title}
              </Link>
              <p className="mt-3 text-slate-600">{post.excerpt}</p>
              <div className="mt-4 space-y-3 text-slate-600">
                {post.paragraphs.slice(0, 2).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <Link
                href={`/blog/${post.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
              >
                Read the full 800-word analysis →
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {post.stats.map((stat) => (
              <div
                key={stat.label + stat.value}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
