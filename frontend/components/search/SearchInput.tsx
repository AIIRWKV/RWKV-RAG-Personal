"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  onSearch: (query: string) => void
  isSearching: boolean
}

export function SearchInput({ onSearch, isSearching }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isInternetSearch, setIsInternetSearch] = useState(true)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center gap-4 p-4 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* <div className="flex items-center gap-2 w-full sm:w-auto">
        <Switch 
          id="is_internet_search" 
          checked={isInternetSearch} 
          onCheckedChange={setIsInternetSearch}
          disabled={isSearching}
        />
        <Label htmlFor="is_internet_search" className="text-sm whitespace-nowrap">联网搜索</Label>
      </div> */}
      <div className="flex items-center gap-2 w-full">
        <Input
          type="text"
          placeholder="搜索"
          className="flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isSearching) {
              handleSearch()
            }
          }}
          disabled={isSearching}
        />
        <motion.button
          className={cn(
            "p-2 bg-blue-500 text-white rounded transition-colors duration-200",
            isSearching ? "bg-blue-400" : "hover:bg-blue-600"
          )}
          whileHover={!isSearching ? { scale: 1.05 } : {}}
          whileTap={!isSearching ? { scale: 0.95 } : {}}
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

