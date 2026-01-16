import ReactPlayer from "react-player";

type Props = {
  streamUrl: string;
};

export default function VideoPlayer({ streamUrl }: Props) {
  return (
    <div className="relative w-full h-full bg-black">
      <ReactPlayer
        src={streamUrl}
        playing={true}
        controls={true}
        width="100%"
        height="100%"
        muted={true}
      />
    </div>
  );
}
