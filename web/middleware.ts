import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 如果是根路径，重定向到/apps
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/apps';
    return NextResponse.redirect(url);
  }

  // 获取响应
  const response = NextResponse.next();
  
  // 添加CORS头信息
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// 对所有路径应用中间件，除了静态资源和 Next.js 内部路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件 (public/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
    '/',
    '/api/:path*',
  ],
};