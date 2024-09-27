/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{hostname:"avatars.githubusercontent.com"},{hostname:"images.pexels.com"}]
    },
    compiler:{
        removeConsole:process.env.NODE_ENV==="production"
    }
};

export default nextConfig;
