import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Sertakan Prisma binary engine di standalone build (wajib untuk Hostinger)
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
