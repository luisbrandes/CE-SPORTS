/** @type {import('next').NextConfig} */
const nextConfig = {
  // removed `output: 'export'` to allow middleware, dynamic routes and server features
  // If you still need a static export, consider removing middleware or configuring
  // individual routes with `generateStaticParams()` / `export const dynamic = 'force-dynamic'`.
  distDir: 'out',
};

export default nextConfig;

module.exports = nextConfig;
