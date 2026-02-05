'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductWithId } from '@/lib/validation/product-schema';

interface ProductTableProps {
  products: ProductWithId[];
  onEdit: (product: ProductWithId) => void;
  onDelete: (id: string) => void;
  totalPages: number;
  canWrite?:boolean
}

export const ProductTable = ({
  canWrite,
  products,
  onEdit,
  onDelete,
  totalPages,
}: ProductTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[120px]">Code</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Created</TableHead>
              {canWrite &&<TableHead className="text-right px-6">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="font-mono text-xs font-semibold">{item.code}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{item.currency}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                        : 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                   {canWrite &&
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2 ">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(item.id as string)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Fallback for touch devices (mobile) where hover doesn't exist */}
                    <div className="flex justify-end gap-2 group-hover:hidden sm:hidden">
                       <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8"><Edit2 className="h-4 w-4"/></Button>
                    </div>
                  </TableCell>
}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-muted-foreground">
          Page {currentPage + 1} of {Math.max(totalPages, 1)}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1 || totalPages === 0}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};