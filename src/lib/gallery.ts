export {
  slideshowImages,
  workImages,
  type GalleryFile,
  type WorkFile,
} from "./gallery.gen";

export function captionFor(
  image: { captionUk: string; captionEn: string },
  locale: "uk" | "en",
) {
  return (locale === "en" ? image.captionEn : image.captionUk).trim();
}

export function urlFor(
  image: { urlUk: string; urlEn: string },
  locale: "uk" | "en",
) {
  const primary = (locale === "en" ? image.urlEn : image.urlUk).trim();
  return primary || image.urlUk.trim();
}
