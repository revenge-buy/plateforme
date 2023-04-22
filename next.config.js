/** @type {import('next').NextConfig} */
// const isGithubActions = process.env.GITHUB_ACTIONS || false

// let assetPrefix = ''
// let basePath = '/'

// if (isGithubActions) {
//   // trim off `<owner>/`
//   const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

//   assetPrefix = `/${repo}/`
//   basePath = `/${repo}`
// }

const nextConfig = {
  reactStrictMode: true,
  // assetPrefix: assetPrefix,
  // basePath: basePath,
  images: {
    // loader: 'imgix',
    // path: 'the "domain" of your Imigix source',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/v9fy5pyd/**',
      },
    ],
    domains: ['cdn.sanity.io']
  },
}

module.exports = nextConfig
