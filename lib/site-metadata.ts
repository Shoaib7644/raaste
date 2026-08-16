export const SITE_NAME = "RAASTE";
export const SITE_TITLE = "RAASTE — Indian Road Radio";
export const SITE_DESCRIPTION = "Places you remember. Songs that stayed.";
export const DEFAULT_SITE_URL = "https://raaste.vercel.app";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
export const siteMetadataBase = new URL(siteUrl);

export function absoluteUrl(path: string): string {
  return new URL(path, siteMetadataBase).toString();
}

export const raasteOgImage = absoluteUrl("/og/raaste-og.jpg");
