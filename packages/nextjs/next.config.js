/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "picsum.photos",
      "www.figma.com",
      "unpkg.com",
      "xsgames.co",
      "randomuser.me",
      "ipfs.io",
      "localhost:8080",
    ],
  },
  productionBrowserSourceMaps: true,
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*.api",
      },
    ];
  },
};

module.exports = nextConfig;
