import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  allowedDevOrigins: ['localhost:3000', '192.168.2.189:3000'],
};

const withMDX = createMDX({
})

export default withContentCollections(withMDX(nextConfig));
