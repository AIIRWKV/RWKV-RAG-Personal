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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setSelectedCard(isExpanded ? null : id);
  };

  return (
    <motion.div
      className="border rounded-lg p-4 h-full flex flex-col"
      onClick={toggleExpand}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <p className="text-sm break-all">{content}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
