/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.ttfileserver.com',
        port: '',
        pathname: '',
      },
    ],
  },
  reactStrictMode: false,
  styledComponents: true,
};

module.exports = nextConfig;
