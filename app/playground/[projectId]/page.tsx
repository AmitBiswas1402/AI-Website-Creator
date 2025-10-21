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
  //   console.log(frameId);

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

  return (
    <div>
      <PlayGroundHeader />

      <div className="flex">
        {/* Chat section */}
        <ChatSection messages={frameDetails?.chatMessages ?? []} />

        {/* Website design */}
        <WebsiteDesign />

        {/* Settings */}
        {/* <WebSettings /> */}
      </div>
    </div>
  );
};
export default PlayGround;
