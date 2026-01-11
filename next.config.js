/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/aprendi' : '';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  
  // BasePath para rotas
  basePath: basePath,
  
  // AssetPrefix para assets estáticos (IMPORTANTE!)
  assetPrefix: basePath ? `${basePath}/` : '',
  
  // Para debugging
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;