import withBundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NODE_ENV === "production";

// Keep this minimal for now (tighten later)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "connect-src 'self' https:",
  "font-src 'self' https: data:"
].join("; ");

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.dulcedesaigon.com" },
      { protocol: "https", hostname: "**.wpengine.com" },
      { protocol: "https", hostname: "**.kinsta.cloud" },
      { protocol: "https", hostname: "**.wordpress.com" }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(isProd
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
            : [])
        ]
      }
    ];
  }
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
