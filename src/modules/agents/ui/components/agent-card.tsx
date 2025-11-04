'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumBadge } from './premium-badge';
import { type SampleAgent } from '@/modules/agents/constants/sample-agents';
// Note: premium gating is handled server-side when cloning/creating
import { useRouter } from 'next/navigation';
import { trpc } from '@/trpc/client';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sparkles, Zap } from 'lucide-react';

interface AgentCardProps {
  agent: SampleAgent & { canAccess?: boolean; isPremium?: boolean };
}

export function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: (data) => {
      router.push(`/call/${data.id}`);
    },
  });

  const createFromSample = trpc.agents.createFromSample.useMutation({
    onSuccess: (data) => {
      // Create meeting with the cloned agent
      createMeeting.mutate({
        name: `Meeting with ${agent.name}`,
        agentId: data.agentId,
      });
    },
    onError: (error) => {
      if (error.data?.code === 'FORBIDDEN') {
        setShowUpgradeDialog(true);
      }
    },
  });

  const handleStartMeeting = async () => {
    if (!agent.canAccess) {
      setShowUpgradeDialog(true);
      return;
    }

    // Clone the sample agent for the user, then create meeting
    createFromSample.mutate({ sampleAgentId: agent.id });
  };

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="text-4xl">{agent.icon}</div>
            <div className="flex gap-2">
              {agent.tier === 'premium' && <PremiumBadge />}
              {agent.hasWhiteboard && (
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Whiteboard
                </Badge>
              )}
              {agent.hasGestures && (
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Gestures
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-xl">{agent.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {agent.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Capabilities:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {agent.capabilities.slice(0, 3).map((cap, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{cap}</span>
                </li>
              ))}
              {agent.capabilities.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{agent.capabilities.length - 3} more
                </li>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStartMeeting}
            disabled={createMeeting.isPending || createFromSample.isPending}
            className="w-full"
            variant={agent.canAccess ? "default" : "outline"}
          >
            {(createMeeting.isPending || createFromSample.isPending)
              ? 'Starting...'
              : agent.canAccess
              ? 'Start Meeting'
              : 'Upgrade to Access'}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Premium Feature Required</AlertDialogTitle>
            <AlertDialogDescription>
              This agent requires a premium subscription. Upgrade now to access
              advanced features including interactive whiteboard, real-time
              gestures, and enhanced capabilities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/upgrade')}>
              Upgrade to Premium
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

