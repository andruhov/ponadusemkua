export {
  slideshowImages,
  workImages,
  type GalleryFile,
  type WorkFile,
} from "./gallery.gen";

/** Photos shown in «Наша робота». Extra files stay in `public/work/`. */
export const WORK_GALLERY_LIMIT = 18;

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
