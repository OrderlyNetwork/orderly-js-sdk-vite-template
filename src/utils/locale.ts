// The SDK uses `tc` for Traditional Chinese; HTML requires a BCP 47 tag.
export function getDocumentLanguage(locale: string): string {
  if (locale === "tc") return "zh-Hant";
  if (locale === "zh") return "zh-Hans";
  return locale;
}

export function getDocumentDirection(locale: string): "rtl" | "ltr" {
  return ["ar", "fa", "he"].includes(locale) ? "rtl" : "ltr";
}
