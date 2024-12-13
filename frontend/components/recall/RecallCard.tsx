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

  const filePath = content[1].match(/\/home\/[^\s]+\.txt/)?.[0];

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "A") {
      e.stopPropagation();
      return;
    }
    toggleExpand();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setSelectedCard(isExpanded ? null : id);
  };

  return (
    <motion.div
      className="border rounded-lg p-4 h-full flex flex-col hover:border-blue-400 transition-colors cursor-pointer bg-white shadow-sm"
      onClick={handleClick}
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
                <a
                  href={`file://${filePath}`}
                  className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="flex-shrink-0">📁</span>
                  <span className="break-all">{filePath}</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
