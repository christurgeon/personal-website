import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/lib/photography";
import { MapPinIcon, CameraIcon, ArrowRightIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";
import { CARD_BGS, CARD_FGS, pickByIndex } from "@/lib/riso";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography",
  description: "A collection of photographs from travels around the world.",
  alternates: { canonical: "/photography" },
};

const stickerColors = ["red", "blue", "green", "yellow"] as const;
const cardRotations = ["-0.5deg", "0.4deg", "-0.3deg", "0.6deg"] as const;
const stickerRotations = [-6, 5, -4, 6] as const;

export default function PhotographyPage() {
  const categories = getAllCategories();
  const totalPhotos = categories.reduce((acc, cat) => acc + cat.photos.length, 0);
  const totalCategories = categories.length;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-7">
      {/* Loud hero */}
      <header className="animate-fade-in relative mb-16 md:mb-20">
        <div className="font-mono-label mb-4" style={{ color: "var(--muted)" }}>
          [ 03 / FRAMES ]
        </div>
        <h1 className="font-display leading-[0.92] tracking-[-0.04em] uppercase" style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}>
          Photo{" "}
          <span
            className="inline-block border-[3px] px-[0.12em]"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              transform: "rotate(-2deg)",
            }}
          >
            Graphy
          </span>
        </h1>
        <p className="animate-fade-in-delay-1 mt-6 max-w-2xl text-lg md:text-xl" style={{ color: "var(--muted)" }}>
          A visual diary I keep instead of a written one.
        </p>

        {/* Stats stickers */}
        <div className="animate-fade-in-delay-2 mt-8 flex flex-wrap items-center gap-5">
          <Sticker color="red" rotate={-4}>
            {totalPhotos} Frames
          </Sticker>
          <Sticker color="blue" rotate={3}>
            {totalCategories} Destinations
          </Sticker>
          <Sticker color="yellow" rotate={-2}>
            Shot on Sony
          </Sticker>
        </div>
      </header>

      {/* Empty state */}
      {categories.length === 0 && (
        <div
          className="animate-fade-in-delay-3 py-20 text-center"
          style={{
            background: "var(--card)",
            border: "3px dashed var(--border)",
            boxShadow: "6px 6px 0 var(--border)",
          }}
        >
          <CameraIcon className="mx-auto mb-4 h-12 w-12" />
          <h2 className="font-display mb-3 text-2xl uppercase">No photos yet</h2>
          <p style={{ color: "var(--muted)" }}>Check back soon for new collections.</p>
        </div>
      )}

      {/* Categories grid */}
      <section className="animate-fade-in-delay-3">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {categories.map((category, index) => {
            const stripBg = pickByIndex(CARD_BGS, index);
            const stripFg = pickByIndex(CARD_FGS, index);
            const stickerColor = pickByIndex(stickerColors, index);
            const rotate = pickByIndex(cardRotations, index);
            const stickerRotate = pickByIndex(stickerRotations, index);
            const destinationNum = String(index + 1).padStart(2, "0");

            return (
              <Link
                key={category.slug}
                href={`/photography/${category.slug}`}
                className="brutal-lift group relative block border-[4px]"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow: "8px 8px 0 var(--border)",
                  transform: `rotate(${rotate})`,
                }}
              >
                {/* Cover image */}
                <div className="relative aspect-[4/3] overflow-hidden border-b-[3px]" style={{ borderColor: "var(--border)" }}>
                  <div className="gallery-image-zoom absolute inset-0">
                    <Image src={category.coverImage} alt={category.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>

                  {/* Floating sticker — top-left */}
                  <div className="pointer-events-none absolute top-4 left-4 z-10">
                    <Sticker color={stickerColor} rotate={stickerRotate}>
                      {category.name}
                    </Sticker>
                  </div>

                  <div
                    className="font-mono-label absolute top-4 right-4 z-10 border-[3px] px-2.5 py-1"
                    style={{
                      background: "var(--paper)",
                      color: "var(--ink)",
                      borderColor: "var(--border)",
                      boxShadow: "3px 3px 0 var(--border)",
                    }}
                  >
                    NO. {destinationNum}
                  </div>
                </div>

                {/* Colored info strip */}
                <div className="flex items-end justify-between gap-4 p-5 md:p-6" style={{ background: stripBg, color: stripFg }}>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono-label mb-2 flex items-center gap-2" style={{ color: stripFg, opacity: 0.9 }}>
                      <MapPinIcon className="h-3.5 w-3.5" />
                      <span>{category.country}</span>
                    </div>
                    <h2
                      className="font-display leading-[0.9] tracking-[-0.03em] uppercase"
                      style={{
                        fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                        color: stripFg,
                      }}
                    >
                      {category.name}
                    </h2>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <span
                      className="font-mono-label inline-flex items-center border-[2px] px-2.5 py-1"
                      style={{
                        background: "var(--paper)",
                        color: "var(--ink)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {category.photos.length} Shots
                    </span>
                    <span
                      className="font-mono-label inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                      style={{ color: stripFg }}
                    >
                      Enter <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
