/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ap-south-1.linodeobjects.com", "localhost"],
  },
  reactStrictMode: false,
  styledComponents: true,
};

module.exports = nextConfig;
