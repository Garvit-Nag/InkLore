import path from 'path'
import { NextConfig } from 'next'

// Ensure you're importing the correct type from Next.js
const nextConfig: NextConfig = {
  webpack(config) {
    // TypeScript understands the config here because it is typed by NextConfig
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src') // Resolves '@' to 'src'
    }
    return config
  }
}

export default nextConfig
