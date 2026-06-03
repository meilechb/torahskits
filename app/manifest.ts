import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Torah Skits",
    short_name: "Torah Skits",
    description:
      "A new parsha skit every week — watch with your family, recreate with your class.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ead7",
    theme_color: "#2c2519",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
