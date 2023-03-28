/** @type {import('next').NextConfig} */
const repo = 'revenge-buy/plateforme'
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/v9fy5pyd/**',
      },
    ],
  },
}

module.exports = nextConfig
