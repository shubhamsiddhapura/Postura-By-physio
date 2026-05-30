/**
 * Public URL for the Share Your Story testimonial submission page.
 * Override with SHARE_STORY_FORM_URL when staging or using a different domain.
 */
export function getShareStoryFormUrl(): string {
  const raw = process.env.SHARE_STORY_FORM_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return "https://www.posturabyphysio.com/share-your-story";
}
