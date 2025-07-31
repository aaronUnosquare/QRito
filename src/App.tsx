import { QrGenerator } from "@/features/QRGenerator";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div className="w-full h-dvh flex items-top justify-center mt-10 lg:mt-0">
      <QrGenerator />
      <Toaster />
    </div>
  );
}

export default App;
