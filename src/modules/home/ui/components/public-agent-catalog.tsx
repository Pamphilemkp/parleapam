'use client';

import { SAMPLE_AGENTS } from '@/modules/agents/constants/sample-agents';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumBadge } from '@/modules/agents/ui/components/premium-badge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PublicAgentCatalog() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleStartMeeting = (agentId: string, isPremium: boolean) => {
    // Store selected agent in sessionStorage for after signup
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedAgentId', agentId);
      sessionStorage.setItem('selectedAgentIsPremium', String(isPremium));
    }
    
    // Redirect to sign up
    router.push('/sign-up');
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SAMPLE_AGENTS.map((agent) => (
        <Card key={agent.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="text-4xl">{agent.icon}</div>
              <div className="flex gap-2 flex-wrap">
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
              onClick={() => handleStartMeeting(agent.id, agent.tier === 'premium')}
              className="w-full"
              variant={agent.tier === 'free' ? "default" : "outline"}
            >
              {agent.tier === 'free' ? (
                <>
                  Start Free Meeting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Get Premium Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

