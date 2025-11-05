"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";
import { PricingCard } from "../components/pricing-card";

export const UpgradeView = () => {

    
    const { data: products, isLoading, error } = trpc.premium.getProducts.useQuery();
    const { data: currentSubscription, isLoading: isLoadingSubscription, error: errorSubscription } = trpc.premium.getCurrentSubscription.useQuery();

    // Handle loading state
    if (isLoading || isLoadingSubscription) {
        return <LoadingState title="Loading Products or Subscription" description="This may take a few seconds"/>;
    }

    // Handle error state
    if (error || errorSubscription) {
    return <ErrorState title="Error loading Products or Subscription" description="Please try again later"/>;
}

  return (
    <div className="flex-1 py-2 sm:py-4 px-2 sm:px-4 md:px-8 flex flex-col gap-y-4 sm:gap-y-10 w-full max-w-full overflow-x-hidden">
       <div className="mt-2 sm:mt-4 flex-1 flex flex-col gap-y-4 sm:gap-y-10 items-center w-full">
         <h5 className="text-xl sm:text-2xl md:text-3xl font-medium text-center px-2">
            You are on the {" "}
            <span className="text-primary font-semibold">
                {currentSubscription?.name || "Free "}
            </span>
            {" "} plan
         </h5>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl px-2 sm:px-4">
            {products?.map((product) => {
              const isCurrentProduct = currentSubscription?.id === product.id;
              const isPremium = !!currentSubscription;
              let buttonText = "Upgrade";
              let onClick = () =>  authClient.checkout({ products: [product.id],});
              if (isCurrentProduct) {
                    buttonText = "Manage";
                    onClick = () => authClient.customer.portal();
              } else if (isPremium) {
                    buttonText = "Change plan";
                    onClick = () => authClient.customer.portal();
                }
                
              return (
                <PricingCard
                      key={product.id}
                      buttonText={buttonText}
                      onClick={onClick}
                      variant={product.metadata.variant === "highlighted" ? "highlighted" : "default"}
                      title={product.name}
                      price={product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0}
                      description={product.description}
                      priceSuffix={` ${product.prices[0].recurringInterval}`}
                      features={product.benefits.map((benefit) => benefit.description)}
                      badge={product.metadata.badge as string | null}
                      />
              );
            })}

         </div>
       </div>
    </div>
  );
}

export const UpgradeViewLoading = () => {

    return (
        <div>
            <LoadingState title="Loading Products or Subscription" description="This may take a few seconds"/>
        </div>
    )

}

export const UpgradeViewError= () => {

    return (
        <div>
            <ErrorState title="Error loading Products or Subscription" description="Please try again later"/>
        </div>
    )

}