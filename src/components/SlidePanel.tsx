import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GripVertical } from "lucide-react";

export default function SlidePanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary/10 hover:bg-primary/20 p-2 rounded-l-lg shadow-lg border-l border-y border-primary/20 transition-colors"
          aria-label="Open slide panel"
        >
          <GripVertical className="w-5 h-5 text-primary" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[80%] sm:w-[400px]">
        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
          Empty Panel Content
        </div>
      </SheetContent>
    </Sheet>
  );
}