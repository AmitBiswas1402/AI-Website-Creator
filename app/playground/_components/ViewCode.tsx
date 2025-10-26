"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { CopyBlock, github } from "react-code-blocks";
import { toast } from "sonner";

const ViewCode = ({ children, code, language = "javascript" }: any) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-7xl max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-4">
              <span>Source Code</span>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" onClick={handleCopy}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex-1 overflow-auto rounded-lg border p-2 code-viewer">
            <CopyBlock
              text={code?.trim() || ""}
              language={language}
              theme={github}
              showLineNumbers
              wrapLongLines
            />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCode;
