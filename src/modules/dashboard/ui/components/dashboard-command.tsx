import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen} className="">
        <CommandInput placeholder="Find a meeting or agent"/>
        <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandItem>Test</CommandItem>
        </CommandList>

    </CommandResponsiveDialog>
  );
}