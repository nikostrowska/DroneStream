import refreshIcon from "../../assets/refreshIcon.svg";
import { useState } from "react";

type Props = {
  onRefresh: () => void;
};

export default function RefreshButton({ onRefresh }: Props) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(true);
    onRefresh();

    setTimeout(() => {
      setSpinning(false);
    }, 1000);

    
  };
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-[#676262] hover:underline transition cursor-pointer"
    >
      <img src={refreshIcon} alt="refresh" className={`w-4 h-4 ${spinning ? "animate-[spinLeft_1.0s_linear_2]" : ""}`} />
      <span className="text-sm font-medium">Refresh</span>
    </button>
  );
}