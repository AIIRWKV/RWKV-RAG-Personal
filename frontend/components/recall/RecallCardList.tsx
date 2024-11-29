import { motion } from "framer-motion";
import { RecallCard } from "./RecallCard";

interface RecallCardListProps {
  title: string;
  results: string[];
  selectedCard: string | null;
  setSelectedCard: (id: string | null) => void;
}

export function RecallCardList({
  title,
  results,
  selectedCard,
  setSelectedCard,
}: RecallCardListProps) {
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <RecallCard
            key={`${title}-${index}`}
            id={`${title}-${index}`}
            content={result}
            isSelected={selectedCard === `${title}-${index}`}
            setSelectedCard={setSelectedCard}
          />
        ))}
      </div>
    </motion.div>
  );
}
