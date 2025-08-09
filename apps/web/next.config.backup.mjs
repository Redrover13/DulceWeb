/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.dulcedesaigon.com' },
      { protocol: 'https', hostname: '**.wpengine.com' },
      { protocol: 'https', hostname: '**.kinsta.cloud' },
      { protocol: 'https', hostname: '**.wordpress.com' }
    ]
  }
}
export default nextConfig
