import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KnowledgeBase {
  id: string;
  name: string;
}

interface KnowledgeBaseListProps {
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBase: KnowledgeBase | null;
  onSelectKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
}

export function KnowledgeBaseList({
  knowledgeBases,
  selectedKnowledgeBase,
  onSelectKnowledgeBase,
}: KnowledgeBaseListProps) {
  return (
    <div className="w-2/5 mr-2">
      <h2 className="text-sm font-semibold mb-2">知识库</h2>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-1">
          {knowledgeBases.map((kb) => (
            <Button
              key={kb.name}
              variant={"ghost"}
              className={`h-12 border w-full justify-start ${
                selectedKnowledgeBase?.name === kb.name ? "bg-[#e8e8ea]" : ""
              }`}
              onClick={() => onSelectKnowledgeBase(kb)}
            >
              {kb.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
