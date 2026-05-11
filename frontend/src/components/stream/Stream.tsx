export default function Stream({
  SerialNumber,
}: {
  SerialNumber: string | null;
}) {
  return (
    <div className="max-h-[800px] relative w-full max-w-[1454px] aspect-video bg-black rounded-[32px] shadow-2xl border-2 border-white overflow-hidden mx-auto mt-5">
      <iframe
        src={`http://${window.location.hostname}:8889/${SerialNumber}`}
        className="w-full h-full rounded-[16px]"
        allow="autoplay"
        title="live stream"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
