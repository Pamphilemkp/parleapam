import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
     CommandEmpty, 
     CommandGroup, 
     CommandInput, 
     CommandItem, 
     CommandResponsiveDialog
    } from "@/components/ui/command";
import { ChevronsUpDownIcon } from "lucide-react";
import { CommandList } from "cmdk";

interface Props {
    options: Array<{
         id: string; 
         value: string;
         children: ReactNode;
     }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value?: string;
    placeholder?: string;
    className?: string;
    isSearchable?: boolean;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    className,
}: Props) => {
    
    const [open, setOpen] = useState(false);
    const selectedOption = options.find(option => option.value === value);

    return (
        <>
          <Button
            variant="outline"
            type="button"
            className={cn("h-9 justify-between font-normal px-2",
             !selectedOption && "text-muted-foreground",   
            className)}
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center">
              {selectedOption ? selectedOption.children : placeholder}
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
          <CommandResponsiveDialog
          shouldFilter={!onSearch} 
          open={open} 
          onOpenChange={setOpen}
          >
            <CommandInput
              placeholder="Search.."
              onValueChange={onSearch}
              className=""
            />
            <CommandList>
              <CommandEmpty>
                 <span className="text-muted-foreground text-s,">No options found.</span>
              </CommandEmpty>
                <CommandGroup>
                    {options.map((option) => (
                    <CommandItem
                        key={option.id}
                        value={option.value}
                        onSelect={() => {
                        onSelect(option.value);
                        setOpen(false);
                        }}
                        className="cursor-pointer"
                    >
                        {option.children}
                    </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
          </CommandResponsiveDialog>
        </>
    );
};