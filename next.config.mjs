/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "http://myyntipalvelu-production.up.railway.app",                
                protocol: "http",
                pathname: "**",
            }
        ]
    }
};

export default nextConfig;
