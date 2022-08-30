/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "https://quiz.bojarm.pl/api",
    // API_URL: "http://localhost:4010",
  },
  images: {
    domains: ["localhost", "power-of-quiz.vercel.app", "quiz.bojarm.pl"],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://quiz.bojarm.pl/api/:path*",
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
