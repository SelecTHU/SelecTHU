/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
	output: "standalone",
	experimental: {
		serverActions: {
			allowedOrigins: ['selecthu.shyuf.cn:8000']
		}
	}
};

module.exports = nextConfig;
