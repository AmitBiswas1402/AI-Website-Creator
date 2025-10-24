import { Button } from "@/components/ui/button";
import { Monitor, TabletSmartphone } from "lucide-react";

const WebPageTools = ({ selectedScreenSize, setSelectedScreenSize }: any) => {
  return (
    <div className="mt-1 p-2 shadow rounded-xl">
      <div className="flex gap-2">
        <Button variant={"ghost"} onClick={() => selectedScreenSize("web")}>
          <Monitor />
        </Button>
        <Button variant={"ghost"} onClick={() => selectedScreenSize("mobile")}>
          <TabletSmartphone />
        </Button>
      </div>
    </div>
  );
};
export default WebPageTools;
