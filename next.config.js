/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  env: {
    PocketbaseIP: 'http://217.160.69.95:8090'
  }
}

module.exports = nextConfig
