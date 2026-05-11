import { type FormEvent, useEffect, useState } from "react";
import type { DroneDTO, UpdateDroneDTO } from "../../types/drone";

type Props = {
  drone: DroneDTO;
  onSubmit: (id: string, data: UpdateDroneDTO) => void;
  onCancel: () => void;
  submitting?: boolean;
};

export default function EditDroneForm({
  drone,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [name, setName] = useState(drone.name);
  const [model, setModel] = useState(drone.model ?? "");
  const [serialNumber, setSerialNumber] = useState(drone.serialNumber);

  useEffect(() => {
    setName(drone.name);
    setModel(drone.model ?? "");
    setSerialNumber(drone.serialNumber);
  }, [drone]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(drone.id, {
      name: name.trim() || undefined,
      model: model.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
    });
  };

  return (
    <form
      className="w-full max-w-3xl bg-white/80 border border-[#D7D7D7] rounded-3xl p-6 shadow-xl mb-8"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-[#1E2126]">Edit drone</h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            Update the drone details based on the backend DTO.
          </p>
        </div>
        <span className="text-sm text-[#7E2A2A]">
          Status: {drone.isOnline ? "online" : "offline"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-2 text-sm text-[#1E2126]">
          Name*
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-[#C5C5C5] px-4 py-3 bg-[#F8F8F8] focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#1E2126]">
          Model
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-xl border border-[#C5C5C5] px-4 py-3 bg-[#F8F8F8] focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#1E2126]">
          Serial Number*
          <input
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="rounded-xl border border-[#C5C5C5] px-4 py-3 bg-[#F8F8F8] focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-4 text-sm text-[#5F5F5F]">
        Last activity:{" "}
        {drone.lastActivity
          ? new Date(drone.lastActivity).toLocaleString()
          : "Not available"}
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
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
