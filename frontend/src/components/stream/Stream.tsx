export default function Stream() {
  return (
    <div className="h-full relative w-full max-w-5xl aspect-video bg-black rounded-[32px] shadow-2xl border-4 border-white overflow-hidden">
      <iframe
        src="http://localhost:8889/mystream"
        className="w-full h-full rounded-[16px]"
        allow="autoplay"
        title="live stream"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
