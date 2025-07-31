import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { useForm } from "@/hooks/useForm";

interface QRViewerProps {
  qrInput: string | null;
  onClear: () => void;
}

type BgFormColor = {
  qrBgColor: string;
  qrFgColor: string;
};

export function QRCodePreview({ qrInput, onClear }: QRViewerProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<Blob | null>(null);
  const handlePrint = useReactToPrint({ contentRef: qrRef });
  const { formData, handleInputChange, handleClear } = useForm<BgFormColor>({
    initialState: {
      qrBgColor: "#FFFFFF",
      qrFgColor: "#000000",
    },
  });

  useEffect(() => {
    if (qrInput) {
      generateImageBlob();
    }
  }, [qrInput]);

  const generateImageBlob = () => {
    if (!qrRef.current) {
      console.error("QR Code reference is not set");
      alert("QR Code reference is not set");
      return;
    }

    const svgElement = qrRef.current.querySelector("svg");

    if (!svgElement) {
      console.error("SVG element not found in QR Code reference");
      alert("SVG element not found in QR Code reference");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });

    // Create image from SVG blob
    const img = new Image();
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      // Draw the image onto a canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Canvas context not available");
        alert("Canvas context not available");
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((canvasBlob) => {
        if (!canvasBlob) {
          console.error("Failed to convert canvas to blob");
          alert("Failed to convert canvas to blob");
          return;
        }

        blobRef.current = canvasBlob;
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    img.src = url;
  };

  const handleDownload = () => {
    if (qrRef.current) {
      htmlToImage
        .toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.setAttribute("download", `qr-code-${crypto.randomUUID()}.png`);
          link.click();
        })
        .catch((error) => {
          console.error("Error downloading QR Code:", error);
        });
    } else {
      console.error("QR Code reference is not set");
    }
  };

  const handleCopy = async () => {
    if (!blobRef.current) {
      console.error("Blob reference is not set");
      alert("Blob reference is not set");
      return;
    }

    try {
      // Copy the blob to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blobRef.current.type]: blobRef.current,
        }),
      ]);

      console.log("QR Code copied to clipboard successfully");
    } catch (err) {
      console.error("Failed to copy QR Code to clipboard:", err);
      alert("Failed to copy QR Code to clipboard");
      alert(err);
    }
  };

  const clearForm = () => {
    handleClear();
    onClear?.();
  };

  const { qrBgColor, qrFgColor } = formData;

  return (
    <div className="w-full h-fit px-5 py-7 bg-gray-100 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:items-center">
      <div className="w-full h-100 bg-white border border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-6 lg:h-120">
        {/* QR Code would be displayed here after generation */}
        {qrInput ? (
          <div ref={qrRef} className="qr-container">
            <QRCode
              value={qrInput}
              size={256}
              viewBox={`0 0 256 256`}
              title="QR Code"
              bgColor={qrBgColor}
              fgColor={qrFgColor}
            />
          </div>
        ) : (
          <span className="text-gray-500">QR Code Preview</span>
        )}
      </div>
      <div className="w-full flex justify-between gap-4 md:justify-center">
        <div className="flex flex-col justify-center gap-1">
          <label htmlFor="qrBgColor" className="text-raven font-semibold">
            Background Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              name="qrBgColor"
              id="qrBgColor"
              className="w-13 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              value={qrBgColor}
              disabled={!qrInput}
              onChange={handleInputChange}
            />
            <div className="min-w-22 h-[42px] px-2 flex items-center border border-gray-300 rounded">
              {qrBgColor}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <label htmlFor="qrFgColor" className="text-raven font-semibold">
            Foreground Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              name="qrFgColor"
              id="qrFgColor"
              className="w-13 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!qrInput}
              value={qrFgColor}
              onChange={handleInputChange}
            />
            <div className="min-w-22 h-[42px] px-2 flex items-center border border-gray-300 rounded">
              {qrFgColor}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2 mt-6 md:flex-row">
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed md:w-fit"
          disabled={!qrInput}
          onClick={handleDownload}
        >
          Download
        </button>
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed md:w-fit"
          disabled={!qrInput}
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed md:w-fit"
          disabled={!qrInput}
          onClick={handleCopy}
        >
          Copy
        </button>
        <button
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed md:w-fit"
          disabled={!qrInput}
          onClick={clearForm}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
