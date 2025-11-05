import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

const PlayGroundHeader = () => {
  const { setOnSaveDate } = useContext(OnSaveContext);
  return (
    <div className="flex justify-between items-center p-5 shadow">
      <Link href={"/workspace"} className="flex items-center gap-2">
        <Image src={"/logo.svg"} alt="logo" width={35} height={35} />
        <h2 className="font-bold text-xl">AI Web Creator</h2>
      </Link>
      <Button onClick={() => setOnSaveDate(Date.now())}>Save</Button>
    </div>
  );
};

export default PlayGroundHeader;