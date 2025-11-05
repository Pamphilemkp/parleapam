import { CircleCheckIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const pricingCardVariants = cva(
  "rounded-lg p-4 py-6 w-full",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        highlighted: "bg-linear-to-br from-[#093C23] to-[#051B16] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const pricingCardIconVariants = cva(
  "size-5",
  {
    variants: {
      variant: {
        default: "fill-primary text-white",
        highlighted: "fill-white text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const pricingCardSecondaryTextVariants = cva(
  "text-neutral-700",
  {
    variants: {
      variant: {
        default: "text-neutral-700",
        highlighted: "text-neutral-300",
      },
    }
  }
);

const pricingCardBadgeVariants = cva(
  "text-black text-xs font-normal p-1",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        highlighted: "bg-[#F5B797]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface Props extends VariantProps<typeof pricingCardVariants> {
    badge?: string | null;
    price: number;
    features: string[];
    title: string;
    description: string | null;
    priceSuffix?: string;
    className?: string;
    buttonText?: string;
    onClick?: () => void;
};

export const PricingCard = ({
  badge,
  price,
  features,
  title,
  description,
  priceSuffix,
  className,
  buttonText,
  onClick,
  variant,
}: Props) => {
  return (
    <div className={cn(pricingCardVariants({ variant }), className, "border w-full max-w-full")}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-x-4 justify-between">
        <div className="flex flex-col gap-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-x-2 flex-wrap">
             <h6 className="text-lg sm:text-xl font-medium break-words">{title}</h6>
            {badge ? (
              <Badge className={cn(pricingCardBadgeVariants({ variant }), "text-xs")}>
                {badge}
              </Badge>
            ) : null}
          </div>
          <p className={cn("text-xs sm:text-sm break-words", pricingCardSecondaryTextVariants({ variant }))}>
            {description}
          </p>
        </div>
        <div className="flex shrink-0 items-end gap-x-0.5">
          <h4 className="text-2xl sm:text-3xl font-medium">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(price)}
          </h4>
            <span className={cn("text-xs sm:text-sm", pricingCardSecondaryTextVariants({ variant }))}>
                {priceSuffix}
            </span>
        </div>
      </div>
      <div className="py-6">
        <Separator className="opacity-10 text-[#5D6B68]" />
      </div>
      <Button 
        onClick={onClick}
        className="w-full touch-target min-h-[44px] text-sm sm:text-base"
        size="lg"
        disabled={!onClick}
        variant={variant === "highlighted" ? "default" : "outline"}
      >
        {buttonText}
      </Button>
      <div className="flex flex-col gap-y-2 mt-3 sm:mt-4">
         <p className="font-medium uppercase text-xs sm:text-sm">Features</p>
         <ul
           className={cn("flex flex-col gap-y-2 sm:gap-y-2.5 text-xs sm:text-sm", pricingCardSecondaryTextVariants({ variant }))}
         >
           {features?.map((feature, index) => (
             <li key={index} className="flex items-start gap-x-2 sm:gap-x-2.5 break-words">
               <CircleCheckIcon className={cn(pricingCardIconVariants({ variant }), "flex-shrink-0 mt-0.5")} />
               <span>{feature}</span>
             </li>
           ))}
         </ul>
      </div>
    </div>
  );
};
