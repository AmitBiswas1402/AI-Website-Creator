"use client";
import { useParams, useSearchParams } from "next/navigation";
import ChatSection from "../_components/ChatSection";
import PlayGroundHeader from "../_components/PlayGroundHeader";
import WebSettings from "../_components/WebSettings";
import WebsiteDesign from "../_components/WebsiteDesign";
import axios from "axios";
import { useEffect, useState } from "react";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type Messages = {
  role: string;
  content: string;
};

const PlayGround = () => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetails, setFrameDetails] = useState<Frame>();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>();

  useEffect(() => {
    frameId && GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      "/api/frames?frameId=" + frameId + "&projectId=" + projectId
    );
    console.log(result.data);
    setFrameDetails(result.data);
  };

  const SendMessage = async (userInput: string) => {
    setLoading(true);

    // Add user message to chart
    setMessages((prev: any) => [...prev, { role: "user", content: userInput }]);

    const result = await fetch("/api/ai-model", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: userInput }],
      }),
    });

    let aiResponse = "";
    let isCode = false;
    const reader = result.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {

      //@ts-ignore
      const { done, value } = await reader?.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      aiResponse += chunk;

      if (!isCode && aiResponse.includes("```html")) {
        isCode = true;
        const index = aiResponse.indexOf("```html") + 7;
        const initialCodeChunk = aiResponse.slice(index);
        setGeneratedCode((prev: any) => prev + initialCodeChunk);
      } else if (isCode) {
        setGeneratedCode((prev: any) => prev + chunk);
      }
    }

    // After streaming end
    if (!isCode) {
      setMessages((prev: any) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } else {
      setMessages((prev: any) => [
        ...prev,
        { role: "assistant", content: "Your code is ready!" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div>
      <PlayGroundHeader />

      <div className="flex">
        {/* Chat section */}
        <ChatSection
          messages={messages ?? []}
          onSend={(input: string) => SendMessage(input)}
        />

        {/* Website design */}
        <WebsiteDesign />

        {/* Settings */}
        {/* <WebSettings /> */}
      </div>
    </div>
  );
};
export default PlayGround;
