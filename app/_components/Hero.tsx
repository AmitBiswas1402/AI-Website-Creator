"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  Loader2Icon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const suggestions = [
  {
    label: "Dashboard",
    prompt:
      "Create a responsive SaaS analytics dashboard with KPI cards, revenue and customer charts, and a recent activity table. Clean, minimal, grid-based layout.",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Design a modern signup form with email/password fields, Google and GitHub auth buttons, and a terms checkbox. Focus on clarity, spacing, and responsiveness.",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Build a bold SaaS hero section with an announcement badge, gradient title, short subtitle, CTA buttons, social proof, and a mockup image. Polished and balanced.",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Design a sleek user profile card with avatar, full name, bio, follower stats, and a Follow button. Smooth hover, rounded corners, and light/dark support.",
    icon: User,
  },
];

const Hero = () => {
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const CreateNewProject = async () => {
    setLoading(true);
    const projectId = uuidv4();
    const frameId = genRandom();
    const message = [
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      const result = await axios.post("/api/projects", {
        projectId,
        frameId,
        message,
      });
      console.log(result.data);
      toast.success("Project created!");
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setLoading(false);
    } catch (error) {
      toast.error("Internal server error");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      {/* Headers */}
      <h2 className="font-bold text-7xl">What should we Design?</h2>
      <p className="mt-2 text-xl text-gray-500">Explore with AI</p>

      {/* input box */}
      <div className="w-full max-w-xl p-5 border mt-5 rounded-2xl">
        <textarea
          placeholder="Describe your page design"
          className="w-full h-24 focus:outline-none focus:ring-0 resize-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value[0])}
        />
        <div className="flex justify-between items-center">
          <Button variant={"ghost"} size={"icon"}>
            <ImagePlus />
          </Button>
          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <Button
                size={"icon-lg"}
                className="rounded-full"
                disabled={!userInput}
              >
                <ArrowUp />
              </Button>
            </SignInButton>
          ) : (
            <Button
              size={"icon-lg"}
              className="rounded-full"
              disabled={!userInput || loading}
              onClick={CreateNewProject}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </Button>
          )}
        </div>
      </div>

      {/* suggestions list */}
      <div className="mt-4 flex gap-2.5">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant={"outline"}
            onClick={() => setUserInput(suggestion.prompt)}
          >
            <suggestion.icon />
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;

const genRandom = () => {
  const num = Math.floor(Math.random() * 10000);
  return num;
};
