import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";
import Image from "next/image";
import { useContext } from "react";

const PlayGroundHeader = () => {
  const { onSaveDate, setOnSaveDate } = useContext(OnSaveContext);
  return (
    <div className="flex justify-between items-center p-4 shadow">
      <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
      <Button onClick={() => setOnSaveDate(Date.now())}>Save</Button>
    </div>
  );
};

export default PlayGroundHeader;