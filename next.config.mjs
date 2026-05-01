


/** @type {import('next').NextConfig} */
// NEXT CONFIGURATION
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            { hostname: 'images.app.goo.gl' },
            { hostname: 'res.cloudinary.com' },
          
        ],
    },
};

export default nextConfig