"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { BlogDto } from "@repo/types";
import { FadeIn } from "../../components/ui/FadeIn";
import { PrimaryCTAButton } from "../../components/ui/PrimaryCTAButton";

type BlogsGridProps = {
  posts: BlogDto[];
  initialCount?: number;
  step?: number;
};

export default function BlogsGrid({
  posts,
  initialCount = 6,
  step = 6,
}: BlogsGridProps) {
  const safeInitial = Math.max(0, initialCount);
  const safeStep = Math.max(1, step);
  const [visibleCount, setVisibleCount] = useState(safeInitial);

  const visiblePosts = useMemo(
    () => posts.slice(0, visibleCount),
    [posts, visibleCount]
  );

  const hasMore = posts.length > visibleCount;

  return (
    <>
      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
        {visiblePosts.map((post) => (
          <FadeIn
            key={post.id}
            direction="up"
            duration={850}
            distance={30}
            delay={0}
          >
            <Link href={`/blogs/${post.slug}`} className="block h-full">
              <article className="group relative h-full overflow-hidden rounded-[28px] bg-gray-100 shadow-sm">
                <div className="relative h-[320px] w-full md:h-[420px]">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 30vw, 90vw"
                    priority={false}
                  />
                </div>

                <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary shadow-sm">
                  <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 min-w-0 rounded-2xl bg-white/95 p-4 shadow-sm backdrop-blur">
                  <h3
                    className="truncate text-sm font-semibold text-gray-900"
                    title={post.title}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">{post.date}</p>
                </div>
              </article>
            </Link>
          </FadeIn>
        ))}
      </div>

      {posts.length > safeInitial && hasMore ? (
        <FadeIn
          direction="up"
          duration={850}
          distance={30}
          delay={120}
          className="mt-10 flex justify-center"
        >
          <PrimaryCTAButton
            href="#"
            label="View More"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setVisibleCount((c) => Math.min(posts.length, c + safeStep));
            }}
          />
        </FadeIn>
      ) : null}
    </>
  );
}

