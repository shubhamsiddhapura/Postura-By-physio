import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, MessageSquareQuote, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { blogsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getBlogStats() {
  try {
    const [all, published] = await Promise.all([
      blogsApi.list({ limit: 1 }),
      blogsApi.list({ limit: 1, published: true }),
    ]);
    return {
      total: all.meta?.total ?? 0,
      published: published.meta?.total ?? 0,
      reachable: true,
    };
  } catch {
    return { total: 0, published: 0, reachable: false };
  }
}

const tiles = [
  {
    label: "Blogs",
    href: "/blogs",
    description: "Write and manage articles shown on the website.",
    icon: FileText,
    enabled: true,
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    description: "Moderate and publish client reviews.",
    icon: MessageSquareQuote,
    enabled: false,
  },
  {
    label: "Services",
    href: "/services",
    description: "Update the service catalogue.",
    icon: Stethoscope,
    enabled: false,
  },
  {
    label: "Gallery",
    href: "/gallery",
    description: "Manage clinic photos and videos.",
    icon: ImageIcon,
    enabled: false,
  },
];

export default async function DashboardPage() {
  const stats = await getBlogStats();

  return (
    <>
      <PageHeader
        title="Welcome back"
        description="Quick overview of what's live on Postura by Physio."
      />

      <div className="space-y-8 px-8 py-8">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            At a glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total blogs" value={stats.total} />
            <StatCard label="Published" value={stats.published} />
            <StatCard label="Drafts" value={Math.max(0, stats.total - stats.published)} />
            <StatCard
              label="API"
              value={stats.reachable ? "Online" : "Offline"}
              tone={stats.reachable ? "ok" : "bad"}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Manage content
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tiles.map((tile) => {
              const Icon = tile.icon;
              const inner = (
                <Card className="group h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4">
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gray-900 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{tile.label}</h3>
                        {!tile.enabled ? (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            Soon
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{tile.description}</p>
                    </div>
                    {tile.enabled ? (
                      <ArrowRight className="mt-1.5 h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-700" />
                    ) : null}
                  </CardContent>
                </Card>
              );

              return tile.enabled ? (
                <Link key={tile.label} href={tile.href}>
                  {inner}
                </Link>
              ) : (
                <div key={tile.label} className="pointer-events-none opacity-75">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: "ok" | "bad";
}) {
  const toneClass =
    tone === "bad" ? "text-red-600" : tone === "ok" ? "text-emerald-600" : "text-gray-900";
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
