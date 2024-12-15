Deno.serve(async (req:Request) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  console.log("Path:", url.pathname);
  console.log("Query parameters:", 
    Object.fromEntries(new URLSearchParams(url.searchParams)));

  console.log("Headers:", JSON.stringify(req.headers));
  console.log("Headers.host:",req.headers.get("host"))

  if (req.body) {
    const body = await req.text();
    console.log("Body:", body);
  }
  
  return new Response("Hello, World!");
});