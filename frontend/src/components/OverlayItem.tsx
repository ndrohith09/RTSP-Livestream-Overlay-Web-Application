import { Rnd } from "react-rnd"; 
import { api } from "../api/service";
import type { Overlay } from "../types";

type Props = {
  overlay: Overlay;
  onUpdate: () => void;
  onDelete: () => void;
};

export default function OverlayItem({ overlay, onUpdate, onDelete }: Props) {
  const updateOverlay = (data: Partial<Overlay>) => {
    api.put(`/overlays/${overlay._id}`, data).then(onUpdate);
  };

  return (
    <Rnd
  size={{
    width: overlay.size.width,
    height: overlay.size.height,
  }}
  position={{
    x: overlay.position.x,
    y: overlay.position.y,
  }}
  onDragStop={(e, d) =>
    updateOverlay({
      position: { x: d.x, y: d.y },
    })
  }
  onResizeStop={(e, dir, ref, delta, pos) =>
    updateOverlay({
      size: {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      },
      position: pos,
    })
  }
  bounds="parent"
  className="absolute z-10 hover:border hover:border-blue-500 group"
>
  {/* CONTENT */}
  {overlay.type === "text" ? (
    <div className="w-full h-full flex items-center justify-center bg-black/50 text-white text-sm select-none">
      {overlay.content}
    </div>
  ) : (
    <img
      src={overlay.content}
      alt="overlay"
      className="w-full h-full object-contain pointer-events-none"
    />
  )}

  {/* DELETE BUTTON (HOVER ONLY) */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete();
    }}
    className="
      absolute 
      -top-5 
      -right-5 
      hidden 
      group-hover:flex
      items-center
      justify-center
      w-6 
      h-6 
      rounded-full
      bg-red-600 
      text-white 
      text-xs 
      shadow-lg
      hover:bg-red-700
      cursor-pointer
      pointer-events-auto
    "
  >
    ✕
  </button>
</Rnd>
  );
}
