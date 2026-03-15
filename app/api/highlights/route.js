let highlightsStore = {}; // Temporary in-memory

export async function POST(request) {
  const body = await request.json();
  const { page, text, comment } = body;

  if (!page || !text) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  if (!highlightsStore[page]) highlightsStore[page] = [];
  highlightsStore[page].push({ text, comment });

  return Response.json({ message: "Saved", data: highlightsStore[page] });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const data = highlightsStore[page] || [];
  return Response.json({ data });
}
