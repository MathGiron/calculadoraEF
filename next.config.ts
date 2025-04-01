import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ou outras configurações existentes
  images: {
    domains: ["cdn.shopify.com"], // Adicione o domínio aqui
  },
};


export default nextConfig;
