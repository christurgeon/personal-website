"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllPhotos, Photo } from "@/lib/photography";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ShuffleIcon, ChevronLeftIcon, CameraIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ShufflePage() {
  const [photos, setPhotos] = useState<Photo[]>(() => shuffleArray(getAllPhotos()));
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setPhotos(shuffleArray(getAllPhotos()));
      setIsShuffling(false);
    }, 300);
  };

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
          [ RANDOM / ALL FRAMES ]
        </div>

        <h1
          className="font-display leading-[0.92] tracking-[-0.04em] uppercase"
          style={{ fontSize: "clamp(2.6rem, 8.5vw, 6rem)" }}
        >
          Shuffled{" "}
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
            Gallery
          </span>
        </h1>

        <p
          className="animate-fade-in-delay-1 mt-6 max-w-2xl text-lg md:text-xl"
          style={{ color: "var(--muted)" }}
        >
          A random arrangement of every frame across every destination. Hit shuffle to roll the dice again.
        </p>

        <div className="animate-fade-in-delay-2 mt-7 flex flex-wrap items-center gap-4">
          <Sticker color="red" rotate={-4}>
            {photos.length} Frames
          </Sticker>
          <Sticker color="blue" rotate={3}>
            Random Order
          </Sticker>
          <button
            onClick={handleShuffle}
            disabled={isShuffling}
            className="brutal-lift-sm font-mono-label inline-flex items-center gap-2 border-[3px] px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              borderColor: "var(--border)",
              boxShadow: "4px 4px 0 var(--border)",
            }}
          >
            <ShuffleIcon className={`h-4 w-4 ${isShuffling ? "animate-spin" : ""}`} />
            {isShuffling ? "Shuffling…" : "Shuffle Again"}
          </button>
        </div>
      </header>

      {/* Gallery */}
      <section
        className="animate-fade-in-delay-3 mb-16"
        suppressHydrationWarning
      >
        {photos.length > 0 ? (
          <div
            className={`transition-opacity duration-300 ${isShuffling ? "opacity-50" : "opacity-100"}`}
          >
            <PhotoGallery photos={photos} showLocation />
          </div>
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
            <h2 className="font-display mb-3 text-2xl uppercase">No photos yet</h2>
            <p style={{ color: "var(--muted)" }}>Check back soon for new photography.</p>
          </div>
        )}
      </section>
    </div>
  );
}
