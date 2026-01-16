import { useEffect, useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import OverlayItem from "./components/OverlayItem";
import OverlayControls from "./components/OverlayControls";
import type { Overlay } from "./types";
import { api } from "./api/service";

export default function App() {
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [streamUrl, setStreamUrl] = useState("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");

  const fetchOverlays = async () => {
    const res = await api.get("/overlays");
    console.log(res.data);
    setOverlays(res.data);
  };

  useEffect(() => {
    fetchOverlays();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <h1 className="text-2xl font-bold mb-6 text-center">
    RTSP Livestream Overlay App
  </h1>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* LEFT: VIDEO PLAYER */}
    <div className="lg:col-span-2 bg-black rounded-xl shadow-lg p-3">
      {streamUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <VideoPlayer streamUrl={streamUrl} />

          {/* Overlays */}
          {overlays.map((overlay) => (
            <OverlayItem
              key={overlay._id}
              overlay={overlay}
              onUpdate={fetchOverlays}
              onDelete={async () => {
                await api.delete(`/overlays/${overlay._id}`);
                fetchOverlays();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          Enter a stream URL to start playback
        </div>
      )}
    </div>

    {/* RIGHT: SETTINGS PANEL */}
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">
        Stream Settings
      </h2>

      <input
        placeholder="Enter RTSP / HLS stream URL"
        value={streamUrl}
        onChange={(e) => setStreamUrl(e.target.value)}
        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Overlay Controls</h3>
        <OverlayControls refresh={fetchOverlays} />
      </div>
    </div>

  </div>
</div>

  );
}
