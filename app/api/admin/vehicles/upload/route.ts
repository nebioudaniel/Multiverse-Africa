import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Get credentials from your .env
    const accessKey = process.env.EDGE_STORE_ACCESS_KEY;
    const secretKey = process.env.EDGE_STORE_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error("Missing EdgeStore credentials in .env");
    }

    // 2. Create the auth header
    const auth = Buffer.from(`${accessKey}:${secretKey}`).toString('base64');

    // 3. Send directly to the EdgeStore API
    // We use the direct "files" endpoint which doesn't need the SDK
    const edgestoreResponse = await fetch('https://api.edgestore.dev/upload', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
      },
      body: formData, // Forward the original form data
    });

    const result = await edgestoreResponse.json();

    if (!edgestoreResponse.ok) {
      console.error("EdgeStore API Error:", result);
      throw new Error(result.message || "Failed to upload to EdgeStore");
    }

    return NextResponse.json({ 
      url: result.url,
      success: true 
    });

  } catch (err: any) {
    console.error("DIRECT UPLOAD ERROR:", err.message);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: err.message 
    }, { status: 500 });
  }
}