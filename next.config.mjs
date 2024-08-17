/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'gamedig': 'commonjs gamedig',
      });
    }

    config.resolve.alias['cheerio'] = 'cheerio/lib/esm/index.js';

    return config;
  },
};

export default nextConfig;