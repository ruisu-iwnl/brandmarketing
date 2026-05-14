import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // Force static export for the demo branch
  output: 'export',
  
  // GitHub Pages doesn't support Next.js Image Optimization at runtime
  images: {
    unoptimized: true,
  },

  // If you are deploying to a GitHub user/org page (username.github.io) 
  // you don't need a basePath. If you are deploying to username.github.io/repo-name,
  // uncomment the line below and replace 'repo-name' with your actual repo name.
  basePath: isGithubActions ? '/brandmarketing' : '',
};

export default nextConfig;
