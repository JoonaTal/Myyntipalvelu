/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'localhost',
            'http://myyntipalvelu-production.up.railway.app'
        ]
    }
};

export default nextConfig;
