import React from "react";

interface ResolveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ResolveTicketModal: React.FC<ResolveTicketModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold">Resolve Ticket</h2>
        <p className="mt-2">Are you sure you want to resolve this ticket <br /> This action is irreversible?</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Resolving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolveTicketModal;
