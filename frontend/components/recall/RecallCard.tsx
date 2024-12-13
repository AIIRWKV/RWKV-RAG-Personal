import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RecallCardProps {
  id: string;
  content: string;
  isSelected: boolean;
  setSelectedCard: (id: string | null) => void;
}

export function RecallCard({
  id,
  content,
  isSelected,
  setSelectedCard,
}: RecallCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filePath = content[1].match(/\/[^\s]+\.[^\/\s]+/)?.[0];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setSelectedCard(isExpanded ? null : id);
  };

  return (
    <motion.div
      className="border rounded-lg p-4 h-full flex flex-col hover:border-blue-400 transition-colors cursor-pointer bg-white shadow-sm"
      onClick={toggleExpand}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <div className="text-sm space-y-2">
            <p className="text-gray-700">{content[0]}</p>
            {filePath && (
              <div className="pt-2 border-t">
                <div className="text-gray-500 flex items-center gap-1 break-all">
                  <span className="flex-shrink-0">📁</span>
                  <span className="break-all">{filePath}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
