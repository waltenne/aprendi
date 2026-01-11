/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'aprendi';
const basePath = isGithubPages ? `/${repoName}` : '';
const assetPrefix = isGithubPages ? `/${repoName}/` : '';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  
  // 🔥 CONFIGURAÇÃO CRÍTICA PARA ASSETS
  images: {
    unoptimized: true,
    path: assetPrefix + '_next/image',
  },
  
  trailingSlash: true,
  
  // BasePath e AssetPrefix
  basePath: basePath,
  assetPrefix: assetPrefix,
  
  // 🔥 Webpack config para forçar prefixo em todos os assets
  webpack: (config, { dev, isServer }) => {
    // Modificar o publicPath para incluir o basePath
    if (!dev && !isServer) {
      config.output.publicPath = assetPrefix + '_next/';
    }
    
    return config;
  },
  
  // 🔥 Configuração experimental para export estático
  experimental: {
    // Garantir que todos os assets usem o assetPrefix
    optimizeCss: false,
  },
};

module.exports = nextConfig;