import { describe, it, expect } from "vitest";
import { getAllCategories, getCategoryBySlug, getAllPhotos, getShuffledPhotos, photoCategories } from "../photography";

describe("getAllCategories", () => {
  it("returns all categories", () => {
    const categories = getAllCategories();
    expect(categories).toBe(photoCategories);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("each category has required fields", () => {
    for (const category of getAllCategories()) {
      expect(category.slug).toBeTruthy();
      expect(category.name).toBeTruthy();
      expect(category.country).toBeTruthy();
      expect(category.description).toBeTruthy();
      expect(category.coverImage).toBeTruthy();
      expect(category.photos.length).toBeGreaterThan(0);
    }
  });

  it("each photo has required fields", () => {
    for (const photo of getAllPhotos()) {
      expect(photo.id).toBeTruthy();
      expect(photo.src).toBeTruthy();
      expect(photo.alt).toBeTruthy();
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
  });

  it("category slugs are unique", () => {
    const slugs = getAllCategories().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("photo IDs are unique", () => {
    const ids = getAllPhotos().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getCategoryBySlug", () => {
  it("returns a category for a valid slug", () => {
    const category = getCategoryBySlug("new-york-city");
    expect(category).toBeDefined();
    expect(category!.name).toBe("New York City");
  });

  it("returns undefined for an invalid slug", () => {
    expect(getCategoryBySlug("nonexistent")).toBeUndefined();
  });
});

describe("getAllPhotos", () => {
  it("returns a flat array of all photos across categories", () => {
    const allPhotos = getAllPhotos();
    const expectedCount = photoCategories.reduce((sum, c) => sum + c.photos.length, 0);
    expect(allPhotos.length).toBe(expectedCount);
  });
});

describe("getShuffledPhotos", () => {
  it("returns the same number of photos as getAllPhotos", () => {
    expect(getShuffledPhotos().length).toBe(getAllPhotos().length);
  });

  it("contains all the same photo IDs", () => {
    const originalIds = getAllPhotos()
      .map((p) => p.id)
      .sort();
    const shuffledIds = getShuffledPhotos()
      .map((p) => p.id)
      .sort();
    expect(shuffledIds).toEqual(originalIds);
  });
});
