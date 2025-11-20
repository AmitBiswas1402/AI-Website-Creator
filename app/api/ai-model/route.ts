import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // model: "google/gemma-3-4b-it:free", 
        model: "google/gemma-3-27b-it:free",
        // model: "meta-llama/llama-4-maverick:free",
        // model: "google/gemini-2.0-flash-exp:free",
        messages,
        stream: true, // enable streaming
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // optional
          "X-Title": "My Next.js App", // optional
        },
        responseType: "stream", // important for streaming
      }
    );

    const stream = response.data;

    // Return as a web stream so frontend can consume
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        stream.on("data", (chunk: any) => {
          const payloads = chunk.toString().split("\n\n");
          for (const payload of payloads) {
            if (payload.includes("[DONE]")) {
              controller.close();
              return;
            }
            if (payload.startsWith("data:")) {
              try {
                const data = JSON.parse(payload.replace("data:", ""));
                const text = data.choices[0]?.delta?.content;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (error) {
                console.error("Error parsing stream", error);
              }
            }
          }
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (error: any) => {
          console.error("Stream error", error);
          controller.error(error);
        });
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
