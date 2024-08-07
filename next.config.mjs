/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'localhost',
            'http://myyntipalvelu-production.up.railway.app'
        ]
    }
};

module.exports = nextConfig
