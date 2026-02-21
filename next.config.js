/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  experimental: {
    outputFileTracingIncludes: {
      '/api/config': ['./config/weddings/**'],
      '/api/config/list': ['./config/weddings/**'],
      '/api/config/save': ['./config/weddings/**'],
    },
  },
}

module.exports = nextConfig
