import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { AnimatePresence, motion } from "framer-motion"; // For smooth transitions
import { Menu } from "lucide-react"; // Sidebar toggle icon

const HomePage = () => {
  // Global chat store
  const { selectedUser, isLoading, error } = useChatStore();

  // Local state to toggle sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-base-200">
      {/* Responsive header for mobile sidebar toggle */}
      <div className="flex items-center justify-between p-4 md:hidden bg-base-100 shadow">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Chat App</h1>
        <div></div> {/* Placeholder to balance layout */}
      </div>

      {/* Main chat container */}
      <div className="flex items-center justify-center pt-4 px-4 md:pt-20">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl min-h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar: Visible on desktop or when toggled on mobile */}
            {isSidebarOpen && <Sidebar />}

            {/* Chat area */}
            <div className="flex-1 flex items-center justify-center">
              {error ? (
                // Error handling UI
                <div className="text-center text-red-500 font-medium">
                  Something went wrong. Please try again.
                </div>
              ) : isLoading ? (
                // Loading state UI
                <div className="text-center font-medium animate-pulse">Loading chat...</div>
              ) : (
                // AnimatePresence for smooth transition between states
                <AnimatePresence mode="wait">
                  {!selectedUser ? (
                    <motion.div
                      key="no-chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <NoChatSelected />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <ChatContainer />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
