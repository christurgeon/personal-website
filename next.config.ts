import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    // WebP only: AVIF at the default quality visibly smooths fine texture in the photos,
    // and most of the byte savings come from right-sized `sizes`, not the format.
    formats: ["image/webp"],
    // Photos in public/ are effectively immutable; keep optimized variants cached for 31 days
    // instead of the 4-hour default. Rename a file if you replace its contents.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
