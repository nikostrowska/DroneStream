import editIcon from "../../assets/EditIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function DroneOptionMenu({ onEdit, onDelete }: Props) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface-strong shadow-lg p-2 flex gap-2 border border-theme z-50 theme-transition">
      <button
        onClick={onEdit}
        className="p-2 hover:bg-white rounded-md transition"
      >
        <div className="w-6 h-6  flex items-center justify-center cursor-pointer">
          <img src={editIcon} alt="edit" className="w-6 h-6" />
        </div>
      </button>

      <div className="w-px h-12 bg-[#CECDCB]" />

      <button
        onClick={onDelete}
        className="p-2 hover:bg-white rounded-md transition"
      >
        <div className="w-6 h-6 flex items-center justify-center cursor-pointer">
          <img src={deleteIcon} alt="delete" className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
}
