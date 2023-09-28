/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ap-south-1.linodeobjects.com",
      "https://user-demo-frontend.vercel.app/",
      "localhost",
    ],
  },
  reactStrictMode: false,
  styledComponents: true,
};

module.exports = nextConfig;
