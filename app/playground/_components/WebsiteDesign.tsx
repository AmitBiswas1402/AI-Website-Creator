"use client";
import { useContext, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import WebSettings from "./WebSettingsSection";
import ImageSettingSection from "./ImageSettingsSection";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  generatedCode: string;
};

const HTML_CODE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Flowbite -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- AOS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Lottie -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <!-- Swiper -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Tippy.js -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>

    <style>
      body {
        margin: 0;
        overflow-x: hidden;
      }
      * {
        transition: outline 0.15s ease;
      }
    </style>
  </head>
  <body id="root"></body>
</html>
`;

const WebsiteDesign = ({ generatedCode }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>();
  const { onSaveDate, setOnSaveDate } = useContext(OnSaveContext);
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  // Initialize iframe shell once
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(HTML_CODE);
    doc.close();
  }, []);

  // Attach interactive editing after generatedCode changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("root");
    if (!root) return;

    // Inject generated HTML
    root.innerHTML = (generatedCode || "")
      .replaceAll("```html", "")
      .replaceAll("```", "")
      // .replace(/^html/, "")
      .trim();

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted #3b82f6";
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid #ef4444";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
      console.log("Selected element:", selectedEl);
      setSelectedElement(selectedEl);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl = null;
      }
    };

    // Attach listeners to iframe document (capture all child events)
    doc.addEventListener("mouseover", handleMouseOver);
    doc.addEventListener("mouseout", handleMouseOut);
    doc.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeyDown);

    // Clean up before next update
    return () => {
      doc.removeEventListener("mouseover", handleMouseOver);
      doc.removeEventListener("mouseout", handleMouseOut);
      doc.removeEventListener("click", handleClick);
      doc.removeEventListener("keydown", handleKeyDown);
    };
  }, [generatedCode]);

  useEffect(() => {
    onSaveDate && onSaveCode();
  }, [onSaveDate]);

  const onSaveCode = async () => {
    if (iframeRef.current) {
      try {
        const iframeDoc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          const cloneDoc = iframeDoc.documentElement.cloneNode(
            true
          ) as HTMLElement;

          const AllEls = cloneDoc.querySelectorAll<HTMLElement>("*");
          AllEls.forEach((el) => {
            el.style.outline = "";
            el.style.cursor = "";
          });

          const html = cloneDoc.outerHTML;
          console.log("HTML to save", html);

          const result = await axios.put("/api/frames", {
            designCode: html,
            frameId,
            projectId,
          });
          console.log(result.data);
          toast.success("Saved!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="p-5 w-full flex items-center flex-col">
        <iframe
          ref={iframeRef}
          className={`${
            selectedScreenSize === "web"
              ? "w-full"
              : selectedScreenSize === "tablet"
              ? "w-[768px]"
              : "w-[375px]"
          } h-[600px] border-2 rounded-xl`}
          sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms"
        />
        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
          generatedCode={generatedCode}
        />
      </div>

      {/* Settings */}
      {selectedElement?.tagName == "IMG" ? (
        <ImageSettingSection
          // @ts-ignore
          selectedEl={selectedElement}
          clearSelection={() => setSelectedElement(null)}
        />
      ) : selectedElement ? (
        <WebSettings
          // @ts-ignore
          selectedEl={selectedElement}
          clearSelection={() => setSelectedElement(null)}
        />
      ) : null}
    </div>
  );
};

export default WebsiteDesign;
