export type Overlay = {
  _id: string;
  type: "text" | "image";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
};
