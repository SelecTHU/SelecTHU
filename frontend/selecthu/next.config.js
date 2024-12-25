/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
	output: "standalone",
	experimental: {
		serverActions: {
            allowedOrigins: ['selecthu.shyuf.cn:8000', '101.43.95.253:8000']
		}
	},
    /* eslint: {
        ignoreDuringBuilds: true,
    }, */
};

module.exports = nextConfig;
