// Cloudflare Worker script
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  const init = {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization')
    },
    body: await request.text()
  };
  
  const response = await fetch(url, init);
  const results = await response.json();
  
  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
