/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PocketbaseIP: 'http://127.0.0.1:8090',
    // PocketbaseIP: 'https://pocketbase.mulmibus.de',
  }
}

module.exports = nextConfig
