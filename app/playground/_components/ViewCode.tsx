"use client";

import { useEffect, useRef } from "react";
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
import hljs from "highlight.js/lib/core";

import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";

import "highlight.js/styles/github-dark.css";
import { toast } from "sonner";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);

const ViewCode = ({ children, code, language = "javascript" }: any) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[95vw] max-h-[80vh] overflow-auto">
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
                    <p>Copy Code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <pre className="rounded-lg border p-4 bg-black text-slate-300 overflow-auto ">
            <code ref={codeRef} className={`language-${language}`}>
              {code?.trim() || ""}
            </code>
          </pre>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCode;
