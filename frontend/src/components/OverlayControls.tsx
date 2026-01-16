import { useState } from "react";
import { api } from "../api/service";
import EmojiPicker from "emoji-picker-react";

type Props = {
  refresh: () => void;
};

export default function OverlayControls({ refresh }: Props) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const addTextOverlay = async () => {
    if (!text) return;

    await api.post("/overlays/", {
      type: "text",
      content: text,
    });

    setText("");
    refresh();
  };

  const addImageOverlay = async () => {
    if (!imageUrl) return;

    await api.post("/overlays/", {
      type: "image",
      content: imageUrl,
    });

    setImageUrl("");
    refresh();
  };

  return (
    <div className="space-y-6">

  {/* TEXT OVERLAY */}
  <div className="space-y-2 relative">
    <h4 className="text-sm font-semibold text-gray-700">
      Text / Emoji Overlay
    </h4>

    <div className="flex gap-2">
      <input
        placeholder="Enter text or emoji 😀"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="border rounded-md px-3 text-lg hover:bg-gray-100"
      >
        😀
      </button>
    </div>

    <button
      onClick={addTextOverlay}
      className="w-full bg-blue-500 text-white py-2 rounded-md text-sm hover:bg-blue-600 transition"
    >
      Add Text Overlay
    </button>

    {/* FLOATING EMOJI PICKER */}
    {showPicker && (
      <div className="absolute right-0 top-24 z-50 shadow-xl">
        <EmojiPicker
          onEmojiClick={(emojiData) =>
            setText((prev) => prev + emojiData.emoji)
          }
        />
      </div>
    )}
  </div>

  {/* IMAGE OVERLAY */}
  <div className="space-y-2 border-t pt-4">
    <h4 className="text-sm font-semibold text-gray-700">
      Image / Logo Overlay
    </h4>

    <input
      placeholder="Enter image URL"
      value={imageUrl}
      onChange={(e) => setImageUrl(e.target.value)}
      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
    />

    <button
      onClick={addImageOverlay}
      className="w-full bg-green-500 text-white py-2 rounded-md text-sm hover:bg-green-600 transition"
    >
      Add Image Overlay
    </button>
  </div>

</div>

  );
}
