import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "b", "i", "hr", "img", "br"],
    allowedAttributes: {
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "data"],
  });
}
