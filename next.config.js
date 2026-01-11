/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output estático para GitHub Pages
  output: 'export',
  
  // Desabilitar imagens otimizadas para export estático
  images: {
    unoptimized: true,
  },
  
  // Trailing slash para compatibilidade com GitHub Pages
  trailingSlash: true,
  
  // Base path para GitHub Pages
  // IMPORTANTE: Para waltenne/aprendi, use '/aprendi'
  basePath: process.env.GITHUB_PAGES === 'true' ? '/aprendi' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/aprendi/' : '',
  
  // Desabilitar API routes (não suportadas em export estático)
  // Se você tem API routes, considere usar getStaticProps/getStaticPaths
};

module.exports = nextConfig;