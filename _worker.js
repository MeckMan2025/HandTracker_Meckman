export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add security headers
    const headers = new Headers({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=*, microphone=(), geolocation=(), payment=(), usb=()',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    });

    // Handle different file types
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(await env.ASSETS.fetch(request), { headers });
    }
    
    // Default: serve the asset
    return env.ASSETS.fetch(request);
  }
}