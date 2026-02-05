'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createProductAction, deleteProductAction, updateProductAction } from '@/lib/actions/product-action';
import { Product, ProductWithId } from '@/lib/validation/product-schema';
import { CreateAndUpdateProductModal } from './CreateAndUpdateProductModal';
import { ProductDeleteConfirmation } from './ProductDeleteConfirmation';
import { ProductDetailsModal } from './ProductDetailsModal'; // Import New Modal
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

  // State for Create/Edit
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithId | undefined>();

  // State for View (Read Only)
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<ProductWithId | null>(null);

  // State for Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSaveProduct = async (formData: ProductWithId): Promise<boolean> => {
    try {
      const result = editingProduct
        ? await updateProductAction(formData.id as string, formData as Product)
        : await createProductAction(formData as Product);

      if (result?.serverError) {
        toast.error(result.serverError);
        return false;
      }
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      return true;
    } catch (error) {
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      try {
        const result = await deleteProductAction(deleteId);
        if (result?.serverError) toast.error(result.serverError);
        else toast.success("Product deleted successfully");
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
        onView={(p) => { // Added onView handler
          setViewProduct(p);
          setOpenViewModal(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* Read Only Modal */}
      <ProductDetailsModal
        open={openViewModal}
        setOpen={setOpenViewModal}
        product={viewProduct}
      />

      {/* Create/Update Modal */}
      <CreateAndUpdateProductModal
        open={openModal}
        setOpen={setOpenModal}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}

      <ProductDeleteConfirmation
        confirmDelete={confirmDelete}
        deleteId={deleteId}
        isPending={isPending}
        setDeleteId={setDeleteId}
      />

    </div>
  );
}



