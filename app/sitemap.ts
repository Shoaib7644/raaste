import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-metadata";

const routes = [
  "/",
  "/about",
  "/salon",
  "/dhaba",
  "/monsoon",
  "/bus",
  "/cassette",
  "/truck",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route),
  }));
}
