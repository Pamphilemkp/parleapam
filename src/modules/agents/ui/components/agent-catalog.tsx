'use client';

import { trpc } from '@/trpc/client';
import { AgentCard } from './agent-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AgentCatalog() {
  const { data: sampleAgents, isLoading, error } = trpc.agents.getSampleAgents.useQuery();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'education' | 'career' | 'language' | 'productivity'>('all');

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load agents. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!sampleAgents || sampleAgents.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No sample agents available at this time.
        </AlertDescription>
      </Alert>
    );
  }

  // Filter agents
  const filteredAgents = sampleAgents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const freeAgents = filteredAgents.filter(a => a.tier === 'free');
  const premiumAgents = filteredAgents.filter(a => a.tier === 'premium');

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'education', 'career', 'language', 'productivity'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="all">All ({filteredAgents.length})</TabsTrigger>
          <TabsTrigger value="free">Free ({freeAgents.length})</TabsTrigger>
          <TabsTrigger value="premium">Premium ({premiumAgents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="free" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freeAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {premiumAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

