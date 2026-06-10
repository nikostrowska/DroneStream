import disconnected from "../../assets/disconnectedSvg.svg";

export default function Stream({
  SerialNumber,
}: {
  SerialNumber: string | null;
}) {
  if (!SerialNumber) {
    return (
      <div className="max-h-[800px] relative w-full max-w-[1454px] aspect-video rounded-[24px] shadow-xl border-[0.5px] border-theme overflow-hidden mx-auto mt-5 tracking-wide bg-page flex items-center justify-center theme-transition">
        <img src={disconnected} alt="Drone Disconnected" className="w-3/4 h-3/4 object-contain select-none" draggable={false} />
      </div>

    );
  }

  return (
    <div className="max-h-[800px] relative w-full max-w-[1454px] aspect-video bg-black rounded-[24px] shadow-xl border-[0.5px] border-[#787A7D]  overflow-hidden mx-auto mt-5 group">
      <iframe
        src={`http://${window.location.hostname}:8889/${SerialNumber}`}
        className="w-full h-full border-0"
        allow="autoplay; fullscreen"
        title="live stream"
        loading="lazy"
        allowFullScreen/>
    </div>
  );
}
