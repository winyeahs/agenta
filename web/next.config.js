const nextConfig = {
  /* config options here */
  devIndicators: {
    buildActivity: false
  },
  // 环境变量配置
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_MAP_URL: process.env.NEXT_PUBLIC_MAP_URL,
    NEXT_PUBLIC_DIGITAL_HUMAN_URL: process.env.NEXT_PUBLIC_DIGITAL_HUMAN_URL,
    NEXT_PUBLIC_ICE_SERVERS_URL: process.env.NEXT_PUBLIC_ICE_SERVERS_URL,
    NEXT_PUBLIC_ICE_SERVERS_USERNAME: process.env.NEXT_PUBLIC_ICE_SERVERS_USERNAME,
    NEXT_PUBLIC_ICE_SERVERS_CREDENTIAL: process.env.NEXT_PUBLIC_ICE_SERVERS_CREDENTIAL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
  // 添加headers配置
  async headers() {
    return [
      {
        // WASM 文件支持（VAD 需要）
        source: '/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      {
        // MJS 文件支持（onnxruntime-web 需要）
        source: '/:path*.mjs',
        headers: [
          { key: 'Content-Type', value: 'application/javascript' },
        ],
      },
      {
        // 匹配所有API路由
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        // 为iframe环境添加必要的headers
        source: '/(.*)',
        headers: [
          // 允许在任何iframe中运行 - 移除X-Frame-Options限制
          // { key: 'X-Frame-Options', value: 'DENY' }, // 完全禁止iframe嵌入
          // { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // 只允许同源嵌入
          // 不设置X-Frame-Options，允许跨域iframe嵌入

          // 使用CSP替代X-Frame-Options，提供更灵活的控制
          { key: 'Content-Security-Policy', value: "frame-ancestors *;" },

          // 支持SharedArrayBuffer (VAD需要) - 但这可能与iframe嵌入冲突
          // { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          // { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },

          // 权限策略，允许麦克风访问
          { key: 'Permissions-Policy', value: 'microphone=*, camera=*, geolocation=*' },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // 正确的externals配置方式
    if (!isServer) {
      config.externals = {
        ...(config.externals || {}),
        '@ali/chatui-sdk': 'ChatSDK'
      };
      
      // 忽略 fs 模块（onnxruntime-web 在浏览器中不需要）
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
  
  // 优化性能配置
  swcMinify: true, // 使用 SWC 进行代码压缩，比 Terser 快
  
  // 实验性功能，优化包大小
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'], // 自动优化 antd 和图标的导入
  },
  
  // 编译器优化选项
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 生产环境移除 console
  }
};

export default nextConfig;
