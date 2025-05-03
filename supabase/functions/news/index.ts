const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const response = await fetch(
      'https://newsapi.org/v2/everything?q=(esports OR "competitive gaming" OR "pro gaming") AND (tournament OR championship OR league OR competition)&sortBy=publishedAt&language=en&pageSize=6',
      {
        headers: {
          'X-Api-Key': 'bb6a7b65ed354d2db985f192b9f36f82'
        },
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});