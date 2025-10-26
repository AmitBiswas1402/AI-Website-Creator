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
import { Copy } from "lucide-react";
import { CopyBlock, github } from "react-code-blocks";
import { toast } from "sonner";

const ViewCode = ({ children, code, language = "javascript" }: any) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Copy Copied!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-7xl max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-4">
              Source Code
              <Button variant="secondary" onClick={handleCopy}>
                <Copy />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex-1 overflow-auto rounded-lg border p-2">
            <CopyBlock
              text={code?.trim() || ""}
              language={language}
              theme={github}
              showLineNumbers={true}
              wrapLongLines={true}
              codeBlock
            />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCode;
