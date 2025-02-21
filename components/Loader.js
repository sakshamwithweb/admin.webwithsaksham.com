import { PacmanLoader } from "react-spinners";

export function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <PacmanLoader size={20} color="#9333EA" />
    </div>
  );
}
