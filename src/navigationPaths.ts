/** Rewrite only the legacy page segment, preserving encoded symbols and URL suffixes. */
export function migratePredictionPath(path: string): string {
  return path.replace(/^(\/[a-z]{2})?\/prediction(?=\/|[?#]|$)/, "$1/predict");
}
