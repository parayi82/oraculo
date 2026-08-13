import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'replicate.delivery' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
}

export default config
