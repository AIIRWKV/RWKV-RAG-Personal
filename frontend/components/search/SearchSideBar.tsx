"use client";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

interface SidebarProps {
  data: any[];
}

export function Sidebar({ data }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
      className="w-64 p-4 bg-white rounded-lg shadow-lg"
    >
      <ul>
        {data.map((item, index) => (
          <motion.li
            key={item}
            className="flex items-center gap-2 mb-2 hover:bg-gray-200 p-2 rounded transition-colors duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Checkbox id={item} />
            <label htmlFor={item} className="text-sm cursor-pointer">
              {item}
            </label>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
}
