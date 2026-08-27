import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-metadata";

const routes = [
  "/",
  "/about",
  "/salon",
  "/dhaba",
  "/dads-cassette",
  "/monsoon",
  "/bus",
  "/truck",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route),
  }));
}
