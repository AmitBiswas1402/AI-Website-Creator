"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDetailContext } from "@/context/UserDetailContext";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export function AppSidebar() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserDetailContext);
  const { user } = useUser();

  useEffect(() => {
    GetProjectList();
  }, []);

  const GetProjectList = async () => {
    setLoading(true);
    const result = await axios.get("/api/get-all-projects/");
    console.log(result.data);
    setProjectList(result.data);
    setLoading(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={35} height={35} />
          <h2 className="font-bold text-xl">AI Creator</h2>
        </div>
        <Link href={"/workspace"} className="mt-5 w-full">
          <Button className="w-full">
            <Plus /> Add New Project
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm px-2 text-gray-500">
            Projects
          </SidebarGroupLabel>
          {!loading && projectList.length == 0 && (
            <h2 className="text-sm px-2 text-gray-5000">No projects to show</h2>
          )}
          <div>
            {!loading && projectList.length > 0
              ? projectList.map((project: any, index) => {
                  const chatMessage = project?.chats?.[0]?.chatMessage;
                  let title = "Untitled Project";

                  // If chatMessage is an array of objects with `content`
                  if (Array.isArray(chatMessage) && chatMessage[0]?.content) {
                    title = chatMessage[0].content;
                  }
                  // If chatMessage is a plain string
                  else if (typeof chatMessage === "string") {
                    title = chatMessage;
                  }

                  return (
                    <Link
                      href={`/playground/${project.projectId}?frameId=${project.frameId}`}
                      key={index}
                      className="my-2 p-2 rounded-lg cursor-pointer transition-all duration-200 
                hover:bg-gray-300 hover:border 
                hover:border-black
                  hover:shadow-lg 
                  hover:scale-[1.02] 
                  flex items-center justify-between"
                    >
                      <h2 className="line-clamp-1">{title}</h2>
                    </Link>
                  );
                })
              : [1, 2, 3, 4, 5].map((_, index) => (
                  <Skeleton className="w-full h-10 rounded-lg mt-2" />
                ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 border rounded-xl space-y-3 bg-secondary">
          <h2 className="flex justify-between items-center">
            Remaining Credits{" "}
            <span className="font-bold">{userDetails?.credits ?? 0}</span>
          </h2>
          <Progress value={33} />
          <Button className="w-full">Upgrade Plans</Button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <UserButton />
          <span className="font-semibold text-sm text-gray-700">
            {user?.fullName}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
