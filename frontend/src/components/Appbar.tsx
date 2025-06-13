import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Dummy Avatar component (replace with your own)
export const Avatar = ({ name = "", size = "small" }: { name: string; size: "small" | "big" }) => {
  const initials = name
    .split(" ")
    .map(word => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const sizeClasses = size === "big" ? "w-10 h-10 text-lg" : "w-8 h-8 text-sm";

  return (
    <div className={`bg-slate-500 text-white rounded-full flex items-center justify-center ${sizeClasses}`}>
      {initials || "U"}
    </div>
  );
};

// Function to decode user from JWT
interface DecodedToken {
  id: string;
  name: string;
}

function getUserFromToken(token: string | null): DecodedToken | null {
  try {
    if (!token) return null;
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded;
  } catch (e) {
    console.error("❌ Failed to decode token", e);
    return null;
  }
}

// Appbar Component
export const Appbar = () => {
  const token = localStorage.getItem("token");
  const user = getUserFromToken(token);

  return (
    <div className="border-b border-slate-300 flex justify-between px-10 py-4">
      <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer font-bold text-xl">
        EchoVerse
      </Link>
      <div className="flex items-center">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </Link>
        <div className="flex items-center pb-2">
            <Avatar size="big" name={user?.name || "Anonymous"} />
        </div>
        
      </div>
    </div>
  );
};
