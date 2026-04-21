import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getAllCategories } from "@/lib/photography";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MapPinIcon, ChevronLeftIcon, CameraIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Photography`,
    description: category.description,
    alternates: { canonical: `/photography/${categorySlug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const allCategories = getAllCategories();
  const index = allCategories.findIndex((c) => c.slug === categorySlug);
  const destinationNum = String(index + 1).padStart(2, "0");
  const nextCategory = allCategories[(index + 1) % allCategories.length];
  const prevCategory = allCategories[(index - 1 + allCategories.length) % allCategories.length];

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-7 md:py-10">
      {/* Back link */}
      <Link
        href="/photography"
        className="font-mono-label group mb-8 inline-flex items-center gap-1.5"
        style={{ color: "var(--muted)" }}
      >
        <ChevronLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back to Photography
      </Link>

      {/* Loud header */}
      <header className="animate-fade-in relative mb-12 md:mb-14">
        <div className="font-mono-label mb-4" style={{ color: "var(--muted)" }}>
          [ DESTINATION {destinationNum} / {category.country.toUpperCase()} ]
        </div>

        <h1
          className="font-display leading-[0.92] tracking-[-0.04em] uppercase"
          style={{ fontSize: "clamp(2.6rem, 8.5vw, 6rem)" }}
        >
          {category.name}
        </h1>

        <p
          className="animate-fade-in-delay-1 mt-6 max-w-2xl text-lg md:text-xl"
          style={{ color: "var(--muted)" }}
        >
          {category.description}
        </p>

        {/* Floating meta pills */}
        <div className="animate-fade-in-delay-2 mt-7 flex flex-wrap items-center gap-4">
          <span
            className="font-mono-label inline-flex items-center gap-2 border-[3px] px-3 py-1.5"
            style={{
              background: "var(--paper)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              boxShadow: "3px 3px 0 var(--border)",
            }}
          >
            <MapPinIcon className="h-3.5 w-3.5" />
            {category.country}
          </span>
          <Sticker color="red" rotate={-4}>
            {category.photos.length} Frames
          </Sticker>
          <Sticker color="yellow" rotate={3}>
            No. {destinationNum}
          </Sticker>
        </div>
      </header>

      {/* Gallery */}
      <section className="animate-fade-in-delay-3 mb-16">
        {category.photos.length > 0 ? (
          <PhotoGallery photos={category.photos} />
        ) : (
          <div
            className="py-20 text-center"
            style={{
              background: "var(--card)",
              border: "3px dashed var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
            }}
          >
            <CameraIcon className="mx-auto mb-4 h-12 w-12" />
            <h2 className="font-display mb-3 text-2xl uppercase">Coming Soon</h2>
            <p style={{ color: "var(--muted)" }}>
              Photos from {category.name} will be added soon.
            </p>
          </div>
        )}
      </section>

      {/* Prev / next navigation */}
      {allCategories.length > 1 && (
        <section
          className="mt-12 border-t-[3px] pt-10"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="font-mono-label mb-6" style={{ color: "var(--muted)" }}>
            [ KEEP LOOKING ]
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href={`/photography/${prevCategory.slug}`}
              className="brutal-lift-sm group block border-[3px] p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                boxShadow: "4px 4px 0 var(--border)",
              }}
            >
              <div
                className="font-mono-label mb-3 flex items-center gap-2"
                style={{ color: "var(--muted)" }}
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                Previous
              </div>
              <div
                className="font-display leading-[0.95] tracking-[-0.03em] uppercase"
                style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)" }}
              >
                {prevCategory.name}
              </div>
              <div
                className="font-mono-label mt-2"
                style={{ color: "var(--muted)" }}
              >
                {prevCategory.country}
              </div>
            </Link>

            <Link
              href={`/photography/${nextCategory.slug}`}
              className="brutal-lift-sm group block border-[3px] p-6 text-right"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                boxShadow: "4px 4px 0 var(--border)",
              }}
            >
              <div
                className="font-mono-label mb-3 flex items-center justify-end gap-2"
                style={{ color: "var(--muted)" }}
              >
                Next
                <ChevronLeftIcon className="h-3.5 w-3.5 rotate-180" />
              </div>
              <div
                className="font-display leading-[0.95] tracking-[-0.03em] uppercase"
                style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)" }}
              >
                {nextCategory.name}
              </div>
              <div
                className="font-mono-label mt-2"
                style={{ color: "var(--muted)" }}
              >
                {nextCategory.country}
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
