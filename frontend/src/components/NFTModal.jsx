import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function NFTModal({ isOpen, onClose, item, onBuy }) {
  if (!item) return null;
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>
      <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X />
        </button>
        {item.image && (
          <img src={item.image} alt="" className="w-full h-48 object-cover rounded" />
        )}
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Token #{item.tokenId}
        </h3>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Price: {item.price} ETH
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Seller: {item.seller.slice(0,6)}…{item.seller.slice(-4)}
        </p>
        <button
          onClick={() => onBuy(item.itemId)}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          Buy Now
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}