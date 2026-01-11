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
  // Se você publica no GitHub Pages em https://<user>.github.io/<repo>/
  // configure `GITHUB_PAGES=true` e `GITHUB_REPOSITORY_NAME=repo` no workflow/env,
  // assim o build aplicará o `basePath` e `assetPrefix` automaticamente.
  basePath: process.env.GITHUB_PAGES === 'true' ? `/${process.env.GITHUB_REPOSITORY_NAME}` : undefined,
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? `/${process.env.GITHUB_REPOSITORY_NAME}` : undefined,
  
  // Desabilitar API routes (não suportadas em export estático)
  // Se você tem API routes, considere usar getStaticProps/getStaticPaths
};

module.exports = nextConfig;
