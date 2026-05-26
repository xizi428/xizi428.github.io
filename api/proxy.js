// GitHub Pages 上的简单 CORS 代理
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }
  
  // 只允许代理到 OneNET API
  if (!targetUrl.startsWith('https://api.heclouds.com/')) {
    return new Response('Not allowed', { status: 403 });
  }
  
  // 转发请求
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
  
  // 修改响应头，允许 CORS
  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  return modifiedResponse;
}
