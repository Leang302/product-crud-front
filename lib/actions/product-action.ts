"use server"

import { revalidatePath } from "next/cache";
import { createProduct, deleteProduct, updateProduct } from "../services/product-service";
import { Product } from "../validation/product-schema"

export const createProductAction = async (data: Product) => {
      const res =await createProduct(data);
      if(res.status.code!=="PRODUCT_CREATED"){
        return { serverError: res.status.message };
      }
       revalidatePath("/product");
      return { success: true };
}
export const deleteProductAction = async (id: string) => {
      const res =await deleteProduct(id);
      if(res.status.code!=="PRODUCT_DELETED"){
        return { serverError: res.status.message };
      }
       revalidatePath("/product");
      return { success: true };
}
export const updateProductAction = async (id: string, data: Product) => {
      const res =await updateProduct(id, data);
      if(res.status.code!=="PRODUCT_UPDATED"){
        return { serverError: res.status.message };
      }
      revalidatePath("/product");
      return { success: true };
}