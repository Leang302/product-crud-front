'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProductWithId } from '@/lib/validation/product-schema';
import { CalendarIcon, Tag, DollarSign, Activity, Hash, Info } from 'lucide-react';

interface ProductDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: ProductWithId | null;
}

export const ProductDetailsModal = ({ open, setOpen, product }: ProductDetailsModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Product Information
          </DialogTitle>
          <DialogDescription>
            Detailed overview for {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> Code
              </Label>
              <p className="font-mono font-semibold text-sm bg-muted/50 p-2.5 rounded-md border">
                {product.code}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Name
              </Label>
              <p className="font-medium p-2.5">{product.name}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Description</Label>
            <div className="min-h-[80px] rounded-md border bg-muted/20 p-3 text-sm text-slate-600 leading-relaxed">
              {product.description || <span className="italic opacity-50">No description provided.</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" /> Price
              </Label>
              <p className="font-mono font-bold p-2 text-lg">
                {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Currency</Label>
              <p className="p-2 font-medium">{product.currency}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Status
              </Label>
              <div className="p-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                  product.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              Created: {product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
            </div>
            {product.id && <div>ID: {product.id}</div>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};