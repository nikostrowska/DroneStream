import { useState, type FormEvent } from "react";
import type { AddDroneDTO } from "../../types/drone";

type Props = {
  onSubmit: (data: AddDroneDTO) => void;
  onCancel: () => void;
  submitting?: boolean;
};

export default function AddDroneForm({
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !serialNumber.trim()) return;

    onSubmit({
      name: name.trim(),
      model: model.trim() || undefined,
      serialNumber: serialNumber.trim(),
    });
  };

  return (
    <form
      className="w-full max-w-3xl bg-white/80 border border-[#D7D7D7] rounded-3xl p-6 shadow-xl mb-8"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-[#1E2126]">
            Add new drone
          </h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            Create a new drone entry using the backend DTO shape.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-2 text-sm text-[#1E2126]">
          Name*
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-[#C5C5C5] px-4 py-3 bg-[#F8F8F8] focus:outline-none"
            placeholder="Drone name"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#1E2126]">
          Model
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-xl border border-[#C5C5C5] px-4 py-3 bg-[#F8F8F8] focus:outline-none"
            placeholder="Model identifier"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#1E2126]">
          Serial Number*
          <input
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="rounded-xl border border-[#C5C5C5] px-4 py-3 bg-[#F8F8F8] focus:outline-none"
            placeholder="Serial number"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[#7E2A2A] px-6 py-3 text-sm font-semibold text-[#7E2A2A] hover:bg-[#7E2A2A]/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !serialNumber.trim()}
          className="rounded-full bg-[#7E2A2A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#701C1C] disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Create drone"}
        </button>
      </div>
    </form>
  );
}
