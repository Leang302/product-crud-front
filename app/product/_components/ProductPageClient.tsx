'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createProductAction, deleteProductAction, updateProductAction } from '@/lib/actions/product-action';
import { Product, ProductWithId } from '@/lib/validation/product-schema';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { CreateAndUpdateProductModal } from './CreateAndUpdateProductModal';
import { ProductFilters } from './ProductFilter';
import { ProductTable } from './ProductTable';
export interface AllProductData {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  items: ProductWithId[];
}

export default function ProductPageClient({ allProductsData, canWrite }: { allProductsData: AllProductData, canWrite?: boolean }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductWithId | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleSaveProduct = async (formData: ProductWithId): Promise<boolean> => {
    try {
      if (editingProduct) {
        const result = await updateProductAction(formData.id as string, formData as Product);

        if (result?.serverError) {
          toast.error(result.serverError);
          return false;
        }
        toast.success('Product updated successfully!');
        return true;
      } else {
        const result = await createProductAction(formData as Product);

        if (result?.serverError) {
          toast.error(result.serverError);
          return false;
        }
        toast.success('Product created successfully!');
        return true;
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      try {
        const result = await deleteProductAction(deleteId);
        if (result?.serverError) {
          toast.error(result.serverError);
        } else {
          toast.success("Product deleted successfully");


        }
      } catch (error) {
        toast.error("Failed to delete product");
      } finally {
        setDeleteId(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <ProductFilters
        canWrite={canWrite}
        onOpenCreateModal={() => {
          setEditingProduct(undefined);
          setOpenModal(true);
        }}
      />

      <ProductTable
        canWrite={canWrite}
        products={allProductsData.items}
        totalPages={allProductsData.totalPages}
        onEdit={(p) => {
          setEditingProduct(p);
          setOpenModal(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      <CreateAndUpdateProductModal
        open={openModal}
        setOpen={setOpenModal}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" disabled={isPending} onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={confirmDelete}
              className='ml-2'
            >
              {isPending ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}