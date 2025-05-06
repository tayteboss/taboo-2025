// Use require (CommonJS) to import the plugin
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // Only enable when ANALYZE env var is 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing configurations:
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cdn.sanity.io', 'image.mux.com'],
  },
  // Add any other configurations you might have here
};

// Use module.exports (CommonJS) to export the wrapped config
module.exports = withBundleAnalyzer(nextConfig);