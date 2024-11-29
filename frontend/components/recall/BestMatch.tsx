import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BestMatchProps {
  result: string;
}

export function BestMatch({ result }: BestMatchProps) {
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-4">最佳匹配结果</h2>
      <ScrollArea className="h-48 rounded-md border p-4">
        <p className="text-sm">{result}</p>
      </ScrollArea>
    </motion.div>
  );
}
