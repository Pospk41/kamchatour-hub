/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;