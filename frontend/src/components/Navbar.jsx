import { useState } from "react";
import { Home, Grid, User, LogOut } from "lucide-react";

export default function Navbar({ address, provider }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 shadow">
      <div className="flex items-center space-x-4">
        <Home className="w-6 h-6 text-indigo-600" />
        <span className="font-bold text-lg text-gray-800 dark:text-gray-100">NFT Market</span>
      </div>
      <div className="flex items-center space-x-4">
        <Grid className="w-5 h-5" />
        <User className="w-5 h-5" />
        {address ? (
          <button
            onClick={() => provider.send("eth_requestAccounts", [])}
            className="flex items-center space-x-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded"
          >
            <span>{address.slice(0,6)}…{address.slice(-4)}</span>
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => provider.send("eth_requestAccounts", [])}
            className="text-sm bg-indigo-500 text-white px-3 py-1 rounded"
          >
            Свържи портфейл
          </button>
        )}
      </div>
    </nav>
  );
}