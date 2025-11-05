// /api/proxy/[[...path]].ts

export const config = {
  runtime: 'edge',
};

// Constants and configurations
const ALLOWED_TARGETS = process.env.ALLOWED_TARGETS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
const HEADERS_TO_REMOVE = process.env.HEADERS_TO_REMOVE?.split(',').map(h => h.trim().toLowerCase()).filter(Boolean) ?? [];

// Custom error class for better error handling
class ProxyError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Validation functions
const validateTarget = (targetParam: string | null): URL => {
  if (!targetParam) {
    throw new ProxyError(400, 'Bad Request: "target" query parameter is required.');
  }
  try {
    return new URL(targetParam);
  } catch {
    throw new ProxyError(400, 'Bad Request: Invalid "target" query parameter.');
  }
};

const validateAllowedTarget = (targetUrl: URL): void => {
  if (ALLOWED_TARGETS.length === 0) return;
  
  const targetDomain = targetUrl.hostname;
  const isAllowed = ALLOWED_TARGETS.some(allowedDomain => 
    targetDomain === allowedDomain || targetDomain.endsWith(`.${allowedDomain}`)
  );
  
  if (!isAllowed) {
    throw new ProxyError(403, `Forbidden: Target "${targetDomain}" is not allowed.`);
  }
};

const prepareHeaders = (request: Request, url: URL): Headers => {
  const headers = new Headers(request.headers);
  
  // Remove specified headers
  HEADERS_TO_REMOVE.forEach(header => headers.delete(header));

  // delete headers['set-cookie'];
  // delete headers['content-security-policy'];
  // delete headers['content-security-policy-report-only'];
  // delete headers['clear-site-data'];

  headers.delete('host');
  
  // Set forwarding headers
  headers.set('X-Forwarded-Host', url.host);
  headers.set('X-Forwarded-Proto', url.protocol.slice(0, -1));
  
  return headers;
};

export default async function handler(request: Request) {
  try {
    const url = new URL(request.url);
    const targetUrl = validateTarget(url.searchParams.get('target'));
    validateAllowedTarget(targetUrl);

    const headers = prepareHeaders(request, url);
    
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    if (error instanceof ProxyError) {
      return new Response(error.message, { status: error.status });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
