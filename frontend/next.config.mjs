/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
