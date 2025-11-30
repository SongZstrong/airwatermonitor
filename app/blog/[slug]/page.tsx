import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildBlogPosts } from "@/lib/blogPosts";
import { getAirQualityOverview } from "@/lib/airQuality";
import { getWaterQualityOverview } from "@/lib/waterQuality";

type BlogPostParams = { slug: string };

type BlogPostPageProps = {
  params: Promise<BlogPostParams>;
};

async function fetchPosts() {
  const [air, water] = await Promise.all([
    getAirQualityOverview(),
    getWaterQualityOverview(),
  ]);

  return buildBlogPosts(air, water);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const [{ slug }, posts] = await Promise.all([
    params,
    fetchPosts(),
  ]);
  const post = posts.find((entry) => entry.id === slug);

  if (!post) {
    notFound();
  }

  const related = posts.filter((entry) => entry.id !== slug).slice(0, 3);
  const refreshedLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  return (
    <article className="space-y-6">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      >
        ← Back to insights
      </Link>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Data story
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          {post.title}
        </h1>
        <p className="mt-4 max-w-4xl text-lg text-slate-600">{post.excerpt}</p>
      </div>
      <div className="overflow-hidden rounded-3xl">
        <Image
          src={post.hero}
          alt={post.title}
          width={1200}
          height={640}
          className="h-full w-full rounded-3xl object-cover"
          priority
          unoptimized
        />
        <p className="mt-2 text-xs text-slate-500">{post.credit}</p>
      </div>
      <div className="space-y-5 text-base leading-relaxed text-slate-700">
        {post.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold uppercase tracking-wide text-slate-500">
          Data refresh status
        </p>
        <p className="mt-1 text-base text-slate-700">
          The figures and narrative update automatically whenever OpenAQ or the World Bank publish new readings. This copy reflects data pulled on {refreshedLabel}.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {post.stats.map((stat) => (
          <div
            key={stat.label + stat.value}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-5"
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
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            More field notes
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((entry) => (
              <Link
                key={entry.id}
                href={`/blog/${entry.id}`}
                className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Data story
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {entry.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-slate-900">
                  Keep reading →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const [{ slug }, posts] = await Promise.all([
    params,
    fetchPosts(),
  ]);
  const post = posts.find((entry) => entry.id === slug);

  if (!post) {
    return {
      title: "Blog post not found | Global Air & Water Observatory",
      description:
        "The requested environmental insight could not be located. Explore the main blog for the latest analyses.",
    };
  }

  return {
    title: `${post.title} | Global Air & Water Observatory`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.hero }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.hero],
    },
  };
}
