


/** @type {import('next').NextConfig} */
// NEXT CONFIGURATION
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            { hostname: 'images.app.goo.gl' },
            { hostname: 'res.cloudinary.com' },
            { hostname: 'cdn.prod.website-files.com' },
            {
                protocol: "https",
                hostname: "img.youtube.com",
            },
          
        ],
    },
    experimental: {
        turbo: false
    }
};

export default nextConfig