/**
 * Resolves a public asset path taking into account the base URL (e.g. GitHub Pages subpath).
 * Handles relative paths, absolute paths, and external URLs cleanly.
 */
export function getAssetPath(path: string): string {
  if (!path) return "";
  if (
    path.startsWith("data:") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  // Remove leading slash or './' if present
  const cleanPath = path.replace(/^(\.\/|\/)/, "");
  const base = import.meta.env.BASE_URL || "./";

  if (base.endsWith("/")) {
    return `${base}${cleanPath}`;
  }
  return `${base}/${cleanPath}`;
}
