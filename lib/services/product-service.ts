import { AllProductData } from "@/app/(home)/product/_components/ProductPageClient";
import { Product } from "../validation/product-schema";
import { apiRequest } from "./api-service";

//create
export const createProduct = async (product: Product) => {
    return await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(product)
    });
}
export type ProductQuery  = {
page: number,
size: number,
q?:string,
status? :"ACTIVE" | "INACTIVE"|"ALL",
direction?: "ASC" | "DESC",
}
//get all products
export const getAllProducts = async ({ page, size, q, status, direction }: ProductQuery) => {
    //construct the url
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (q) params.append('q', q);
    
    if (status && status !== 'ALL') params.append('status', status);
    
    if (direction) params.append('direction', direction);
    return await apiRequest<AllProductData>(`/products?${params.toString()}`, {
        method: 'GET'
    });
};
//delete product
export const deleteProduct = async (id: string) => {
    return await apiRequest(`/products/${id}`, {
        method: 'DELETE'
    });
};
//update product
export const updateProduct = async (id: string, product: Product) => {
    return await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
    });
};