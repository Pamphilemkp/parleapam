"use client";
import { PanelLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import {Button} from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

 
 const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(open => !open);
      }};

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  
  }, []);


  return (
    <>
    <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
    <div className="flex items-center gap-x-2 px-2 sm:px-4 py-2 sm:py-3 border-b bg-background shadow-md w-full min-w-0">
      <Button variant="outline" className="size-9 sm:size-10 flex-shrink-0 touch-target"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {(state === "collapsed" || isMobile) ? <PanelLeftCloseIcon className="size-4 sm:size-5" /> : <PanelLeftIcon className="size-4 sm:size-5" />}
      </Button>
      <Button onClick={() => setCommandOpen(open => !open)}
      className="h-9 sm:h-10 flex-1 sm:flex-initial sm:w-[240px] min-w-0 justify-start font-normal text-muted-foreground hover:text-muted-foreground text-sm sm:text-base" variant="outline" size="sm">
        <SearchIcon className="size-4 sm:size-5 flex-shrink-0" />
        <span className="truncate hidden sm:inline">Search</span>
        <kbd className="ml-auto pointer-events-none hidden sm:inline-flex items-center h-6 select-none gap-1 rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="text-xs">&#8984; </span>k
        </kbd>
      </Button>
    </div>
    </>
  );
}

export default DashboardNavbar;