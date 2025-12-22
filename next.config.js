/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Use remotePatterns instead of deprecated images.domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lpphotel.com',
      },
    ],
  },
};

module.exports = nextConfig;
