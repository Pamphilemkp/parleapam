import { LoadingState } from "@/components/loading-state";

export default function Loading() {
  return (
    <LoadingState
      title="Loading Your data"
      description="Please wait while we load your AI agents and data."
    />
  );
}
