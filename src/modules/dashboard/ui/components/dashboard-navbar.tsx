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
      }}

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  
  }, []);


  return (
    <>
    <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
    <div className="flex items-center gap-x-2 px-4 py-3 border-b bg-background shadow-md">
      <Button variant="outline" className="size-9"
        onClick={toggleSidebar}
      >
        {(state === "collapsed" || isMobile) ? <PanelLeftCloseIcon className="size-4" /> : <PanelLeftIcon className="size-4" />}
      </Button>
      <Button onClick={() => setCommandOpen(open => !open)}
      className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground " variant="outline" size="sm">
        <SearchIcon className="" />
        Search
        <kbd className="ml-auto pointer-events-none inline-flex items-center h-6 select-none gap-1 rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="text-xs">&#8984; </span>k
        </kbd>
      </Button>
    </div>
    </>
  );
}

export default DashboardNavbar;