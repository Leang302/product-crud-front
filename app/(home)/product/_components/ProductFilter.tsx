'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductFiltersProps {
  onOpenCreateModal: () => void;
  canWrite?: boolean;
}

export const ProductFilters = ({ onOpenCreateModal, canWrite }: ProductFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initialize local state from URL only ONCE on mount
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [direction, setDirection] = useState(searchParams.get('direction') || 'ASC');

  const debouncedSearch = useDebounce(q, 500);
  
  // Use a ref to track if it's the first render to avoid unnecessary push on mount
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first run so we don't overwrite current URL params with defaults
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (status !== 'ALL') params.set('status', status);
    params.set('direction', direction);
    params.set('page', '0'); // Reset to first page on filter change
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

  }, [debouncedSearch, status, direction, pathname]); 

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Product Management</h3>
         {canWrite ? <p className="text-sm text-muted-foreground">Manage and monitor your product inventory</p> : <p className="text-sm text-muted-foreground">View product inventory</p>}
        </div>
       {canWrite && (
          <Button onClick={onOpenCreateModal} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create Product
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={direction} onValueChange={(val) => setDirection(val)}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Oldest First</SelectItem>
            <SelectItem value="DESC">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};