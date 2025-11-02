"use client";

import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
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
import { useContext, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const suggestions = [
  {
    label: "Dashboard",
    prompt:
      "Create a responsive SaaS analytics dashboard with charts and KPI cards.",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Design a modern signup form with email, password, and social login options.",
    icon: Key,
  },
  {
    label: "Hero",
    prompt: "Build a SaaS hero section with title, subtitle, CTA, and image.",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a user profile card with avatar, name, bio, and follow button.",
    icon: User,
  },
];

const Hero = () => {
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();
  const { has } = useAuth();
  const router = useRouter();

  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  const CreateNewProject = async () => {
    // if (!hasUnlimitedAccess && userDetail?.credits! <= 0) {
    //   toast.error("You have no credits left. Please upgrade your plan.");
    //   return;
    // }

    setLoading(true);
    const projectId = uuidv4();
    const frameId = genRandom();
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      const result = await axios.post("/api/projects", {
        projectId,
        frameId,
        messages,
        // credits: userDetail?.credits,
      });
      console.log(result.data);
      toast.success("Project created!");
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      // setUserDetail((prev: any) => ({
      //   ...prev,
      //   credits: prev?.credits! - 1,
      // }));
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
          onChange={(e) => setUserInput(e.target.value)}
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
