/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 substitui o antigo next export
  distDir: 'out',   // 👈 define a pasta de saída igual ao antigo comportamento
};

export default nextConfig;

