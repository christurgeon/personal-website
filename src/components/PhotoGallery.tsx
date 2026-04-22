"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Photo } from "@/lib/photography";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from "@/components/Icons";

interface PhotoGalleryProps {
  photos: Photo[];
  showLocation?: boolean;
}

export function PhotoGallery({ photos, showLocation = true }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  const currentPhoto = photos[currentIndex];
  const totalStr = String(photos.length).padStart(3, "0");

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {photos.map((photo, index) => {
          const numLabel = String(index + 1).padStart(3, "0");
          const isLoaded = imageLoaded[photo.id];

          return (
            <button
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="animate-gallery-card group relative flex cursor-zoom-in flex-col border-[3px] text-left"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                boxShadow: "4px 4px 0 var(--border)",
                animationDelay: `${Math.min(index * 60, 600)}ms`,
              }}
              aria-label={`Open photo ${numLabel}: ${photo.alt}`}
            >
              {/* Image frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <div className="gallery-image-zoom absolute inset-0">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, [photo.id]: true }))
                    }
                  />
                </div>

                {/* Shimmer while loading */}
                {!isLoaded && (
                  <div className="animate-shimmer absolute inset-0" aria-hidden />
                )}

                {/* Frame number sticker — top-left */}
                <div
                  className="font-display pointer-events-none absolute top-3 left-3 z-10 border-[3px] px-2 py-1 text-[0.72rem] tracking-wide uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background: "var(--yellow)",
                    color: "var(--ink)",
                    borderColor: "var(--border)",
                    boxShadow: "3px 3px 0 var(--border)",
                    transform: "rotate(-4deg)",
                  }}
                >
                  {numLabel}
                </div>
              </div>

              {/* Caption strip */}
              {showLocation && (photo.location || photo.date) && (
                <div
                  className="flex items-center justify-between gap-2 border-t-[3px] px-3 py-2"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="font-mono-label flex min-w-0 items-center gap-1.5"
                    style={{ color: "var(--ink)" }}
                  >
                    {photo.location && (
                      <>
                        <MapPinIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </>
                    )}
                  </div>
                  <span
                    className="font-mono-label shrink-0"
                    style={{ color: "var(--muted)" }}
                  >
                    {numLabel}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox — portaled to body to escape any ancestor with `transform`
          (animate-fade-in-* on the wrapping section makes it the containing
          block for fixed descendants, which collapses this lightbox). */}
      {mounted && lightboxOpen && currentPhoto && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--ink) 94%, transparent)" }}
          onClick={closeLightbox}
        >
          {/* Close button — top-right */}
          <button
            onClick={closeLightbox}
            className="brutal-lift-sm absolute top-5 right-5 z-10 flex h-12 w-12 items-center justify-center border-[3px]"
            style={{
              background: "var(--red)",
              color: "var(--paper)",
              borderColor: "var(--paper)",
              boxShadow: "4px 4px 0 var(--paper)",
            }}
            aria-label="Close lightbox"
          >
            <XIcon className="h-5 w-5" />
          </button>

          {/* Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="brutal-lift-sm absolute left-4 z-10 flex h-12 w-12 items-center justify-center border-[3px] md:left-8"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              borderColor: "var(--paper)",
              boxShadow: "4px 4px 0 var(--paper)",
            }}
            aria-label="Previous photo"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="brutal-lift-sm absolute right-4 z-10 flex h-12 w-12 items-center justify-center border-[3px] md:right-8"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              borderColor: "var(--paper)",
              boxShadow: "4px 4px 0 var(--paper)",
            }}
            aria-label="Next photo"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          {/* Image */}
          <div
            className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              width={currentPhoto.width}
              height={currentPhoto.height}
              className="animate-lightbox-enter block h-auto max-h-[85vh] w-auto border-[4px] object-contain"
              style={{
                borderColor: "var(--paper)",
                boxShadow: "8px 8px 0 var(--paper)",
                background: "var(--ink)",
              }}
              priority
            />
          </div>

          {/* Frame counter + meta */}
          <div
            className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 px-4 text-center"
          >
            <span
              className="font-mono-label pointer-events-auto inline-flex items-center border-[3px] px-3 py-1.5"
              style={{
                background: "var(--paper)",
                color: "var(--ink)",
                borderColor: "var(--paper)",
              }}
            >
              [ {String(currentIndex + 1).padStart(3, "0")} / {totalStr} ]
            </span>
            {currentPhoto.location && (
              <span
                className="font-mono-label pointer-events-auto inline-flex items-center gap-1.5 border-[3px] px-3 py-1.5"
                style={{
                  background: "var(--yellow)",
                  color: "var(--ink)",
                  borderColor: "var(--paper)",
                }}
              >
                <MapPinIcon className="h-3 w-3" />
                {currentPhoto.location}
              </span>
            )}
            {currentPhoto.date && (
              <span
                className="font-mono-label pointer-events-auto inline-flex items-center border-[3px] px-3 py-1.5"
                style={{
                  background: "var(--paper)",
                  color: "var(--ink)",
                  borderColor: "var(--paper)",
                }}
              >
                {currentPhoto.date}
              </span>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
