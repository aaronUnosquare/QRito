import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { useForm } from "@/hooks/useForm";
import { Button } from "@/components/Button";

interface QRViewerProps {
  qrInput: string | null;
  onClear: () => void;
}

type BgFormColor = {
  qrBgColor: string;
  qrFgColor: string;
};

const TOAST_CONFIG = {
  duration: 5000,
};

export function QRCodePreview({ qrInput, onClear }: QRViewerProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<Blob | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: qrRef,
    onAfterPrint: () => {
      toast.success("QR Code printed successfully", TOAST_CONFIG);
    },
  });
  const { formData, handleInputChange, handleClear } = useForm<BgFormColor>({
    initialState: {
      qrBgColor: "#FFFFFF",
      qrFgColor: "#000000",
    },
  });

  useEffect(() => {
    if (qrInput && formData) {
      generateImageBlob();
    }
  }, [qrInput, formData]);

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

          toast.success("QR Code downloaded successfully", TOAST_CONFIG);
        })
        .catch((error) => {
          toast.error(`Error downloading QR Code: ${error}`, TOAST_CONFIG);
        });
    } else {
      toast.error("QR Code reference is not set", TOAST_CONFIG);
    }
  };

  const handleCopy = async () => {
    if (!blobRef.current) {
      toast.error("Blob reference is not set", TOAST_CONFIG);
      return;
    }

    try {
      // Copy the blob to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blobRef.current.type]: blobRef.current,
        }),
      ]);

      toast.success("QR Code copied to clipboard successfully", TOAST_CONFIG);
    } catch (err) {
      toast.error(`Failed to copy QR Code to clipboard: ${err}`, TOAST_CONFIG);
    }
  };

  const clearForm = () => {
    handleClear();
    onClear?.();

    toast.success("Form cleared successfully", TOAST_CONFIG);
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
        <Button disabled={!qrInput} onClick={handleDownload}>
          Download
        </Button>
        <Button disabled={!qrInput} onClick={handlePrint}>
          Print
        </Button>
        <Button disabled={!qrInput} onClick={handleCopy}>
          Copy
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          disabled={!qrInput}
          onClick={clearForm}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
