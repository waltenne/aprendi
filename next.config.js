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
  
  // Base path - descomente e ajuste se o repositório não for username.github.io
  // basePath: '/nome-do-repositorio',
  
  // Desabilitar API routes (não suportadas em export estático)
  // Se você tem API routes, considere usar getStaticProps/getStaticPaths
};

module.exports = nextConfig;
