import slugify from "slugify";

export const generateSlug = (title) =>
  slugify(title, { lower: true, strict: true });
