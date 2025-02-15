import React, { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { useTickets } from "@/src/context/SupportTicketContext";
import { formatDateWithTimeAndDay, timeAgo } from "../utils/dateUtils";
import { AiOutlineCheckCircle } from "react-icons/ai";
import ResolveTicketModal from "@/src/components/ResolveTicketModal"; // Import the modal

interface ChatAreaProps {
  ticket: any; // Ticket object passed from the parent component
}

const ChatArea: React.FC<ChatAreaProps> = ({ ticket }) => {
  const {
    ticket_conversation: conversations,
    customer_name,
    title,
    ticket_id,
    status,
  } = ticket;

  const [message, setMessage] = useState(""); // Message input state
  const { request, loading } = useApi(); // Using the `useApi` hook
  const { refreshTickets } = useTickets();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Function to handle resolving the ticket
  const handleResolveTicket = async () => {
    try {
      await request(
        "/api/core/kitchen-operations/support-ticket/resolve",
        "POST",
        {},
        { id: ticket_id }
      );
      refreshTickets(); // Refresh the tickets context
      alert("Ticket resolved successfully!");
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !ticket_id) return; // Don't send empty messages or if ticket_id is not available

    const payload = {
      ticket_id: ticket_id,
      message: message.trim(),
    };

    try {
      await request(
        "/api/core/kitchen-operations/support-ticket/reply",
        "POST",
        {},
        payload
      );
      const newMessage = {
        id: conversations.length + 1, // Temporary ID
        ticket_id: ticket_id,
        message: message.trim(),
        user_id: "support", // Example: Set as the support user's ID
        customer_name: "Support Agent", // Example: Set support agent name
        is_support: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      ticket.ticket_conversation.push(newMessage);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-100 rounded-t-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            <span>Issue: </span>
            {title}
          </h2>
          <p className="text-sm text-gray-600">{customer_name}</p>
        </div>
        {/* Resolve Button or Icon */}
        {status === "0" ? (
          <button
            onClick={() => setIsModalOpen(true)} // Open the modal
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          >
            Resolve Ticket
          </button>
        ) : status === "3" ? (
          <AiOutlineCheckCircle className="text-green-500 text-2xl" title="Ticket Resolved" />
        ) : null}
      </div>

      {/* Conversations */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {conversations.map((message: any) => (
          <div
            key={message.id}
            className={`p-4 rounded-md rounded-br-none max-w-xs ${
              message.is_support === "1"
                ? "bg-green-100 self-start"
                : "bg-gray-100 text-gray-900 self-end"
            }`}
          >
            <p className="text-sm text-gray-500">
              {message.customer_name} -{" "}
              {formatDateWithTimeAndDay(message.created_at)} -{" "}
              {timeAgo(message.created_at)}
            </p>
            <p>{message.message}</p>
          </div>
        ))}
      </div>

      {/* Input Box for Sending Messages */}
      <div className="p-4 border-t flex items-center space-x-3 bg-gray-100 rounded-b-lg">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Type Message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-4 pr-16 py-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition duration-200"
          />
          <button
            onClick={handleSendMessage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center bg-transparent text-gray-800 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition duration-200 disabled:opacity-50"
            disabled={!message.trim() || loading}
          >
            {loading ? (
              "..."
            ) : (
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.25 4.75l7.25 7.25-7.25 7.25M3 12h18"
                  />
                </svg>
                Send Response
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Resolve Ticket Modal */}
      <ResolveTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal without resolving
        onConfirm={() => {
          handleResolveTicket(); // Resolve ticket when confirmed
          setIsModalOpen(false); // Close modal
        }}
        loading={loading}
      />
    </div>
  );
};

export default ChatArea;
