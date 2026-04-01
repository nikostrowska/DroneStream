import Stream from "../stream/Stream";

export default function MainBackground() {
  return (
    <>
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto flex justify-center items-start">
        <Stream />
      </main>
    </>
  );
}
