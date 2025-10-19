"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

export function AppSidebar() {
  const [projectList, setProjectList] = useState([]);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

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
          {projectList.length == 0}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>
          <h2 className="flex justify-between items-center">
            Remaining Credits{" "}
            <span className="font-bold">
              {userDetails?.credit}
            </span>
          </h2>
          <Progress value={33} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
