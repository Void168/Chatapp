/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        swcPlugins: [
            "next-superjson-plugin", {}
        ]
    },
    images: {
        domains: [
            "res.couldinary.com", "avatars.githubusercontent.com","lh3.googleusercontent.com"
        ]
    }
}

module.exports = nextConfig
