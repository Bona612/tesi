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

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')

    return config
  },
  // compiler: {
  //   relay: relayConfig,
  // },
  // DA VERIFICARE LA PARTE SOTTO, SOPRATTUTTO LA SINTASSI
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        hostname: 'dummyimage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;


// "scripts": {
  //   "dev": "next dev",
  //   "build": "next build",
  //   "start": "next start",
  //   "lint": "next lint",
  //   "relay": "relay-compiler"
  // },

// "relay": {
//     "src": "./",
//     "schema": "../thegraph/relayschema.graphql",
//     "language": "typescript",
//     "artifactDirectory": "./relay/__generated__",
//     "excludes": [
//       "**/node_modules/**",
//       "**/__mocks__/**",
//       "**/__generated__/**"
//     ]
//   },