// /** @type {import('next').NextConfig} */

// // Path: next.config.js
// const nextConfig = {
//   webpack: config => {
//     config.externals.push('pino-pretty', 'lokijs', 'encoding')

//     return config
//   }
// }

// export default nextConfig;

// import relayConfig from './relay.config.json' with { type: 'json' };

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')

    return config
  },
  // DA VERIFICARE LA PARTE SOTTO, SOPRATTUTTO LA SINTASSI
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // {
          //   key: 'Content-Security-Policy',
          //   value: cspHeader.replace(/\n/g, ''),
          // },
          {
            key: 'Permission-Policy',
            value: 'camera=(self)', // Allow camera and microphone access only from the same origin
          },
          // You can add other headers here as needed
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gold-magnificent-stork-310.mypinata.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
