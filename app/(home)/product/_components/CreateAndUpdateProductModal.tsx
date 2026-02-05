'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductWithId, ProductWithIdSchema } from '@/lib/validation/product-schema';

interface CreateProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: ProductWithId;
  onSave: (product: ProductWithId) => Promise<boolean>;
}

export const CreateAndUpdateProductModal = ({
  open,
  setOpen,
  product,
  onSave,
}: CreateProductModalProps) => {
  // Use the product ID as a key to force a clean re-mount of the inner form
  const formKey = product?.id || 'new';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogDescription>
            Enter the details for the product below. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ProductInnerForm
            key={formKey}
            product={product}
            onSave={onSave}
            close={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProductInnerForm = ({
  product,
  onSave,
  close,
}: {
  product?: ProductWithId;
  onSave: (p: ProductWithId) => Promise<boolean>;
  close: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductWithId>({
    resolver: zodResolver(ProductWithIdSchema),
  defaultValues: product ? {
  ...product,
  createdAt: product.createdAt || undefined,
  updatedAt: product.updatedAt || undefined,
} : {
  id: crypto.randomUUID(),
  code: '',
  name: '',
  price: 0,
  currency: 'USD',
  status: 'ACTIVE',
},
  });

  // Sync form if product prop changes after mount
  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  const currentStatus = watch('status');
  const currentCurrency = watch('currency');

  const onSubmit = async (data: ProductWithId) => {
  
    const finalData = {
      ...data,
      id: product?.id || data.id,
    };
  
    const isSuccess = await onSave(finalData);
    if (isSuccess) {
      close();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
  

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Product Code</Label>
          <Input id="code" {...register('code')} disabled={isSubmitting} placeholder='e.g. PRD-001'
           className={errors.code? "border-destructive" : ""}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register('name')} disabled={isSubmitting} placeholder='Product name'
           className={errors.name? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" {...register('description')} disabled={isSubmitting} rows={3} placeholder='Product description'    className={errors.description? "border-destructive" : ""}/>
       {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input 
             id="price" 
             type="number" 
             step="0.01" 
             {...register('price', { valueAsNumber: true })} 
             disabled={isSubmitting} 
                className={errors.price? "border-destructive" : ""}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Currency</Label>
          <Select 
            disabled={isSubmitting}
            value={currentCurrency} 
            onValueChange={(val) => setValue('currency', val as Product['currency'])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="RIEL">RIEL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select 
            disabled={isSubmitting}
            value={currentStatus} 
            onValueChange={(val) => setValue('status', val as Product['status'])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="pt-4 gap-2">
        <Button variant="outline" type="button" onClick={close} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (product ? 'Save Changes' : 'Create Product')}
        </Button>
      </DialogFooter>
    </form>
  );
};