import { getAllProducts, ProductQuery } from '@/lib/services/product-service'
import ProductPageClient from './_components/ProductPageClient'
import { auth } from '@/auth';
export const dynamic = 'force-dynamic';
export default async function page({searchParams}:{searchParams: ProductQuery}) {
   const allProducts = await getAllProducts(await searchParams);
     const session = await auth();
     const roles: string[]|undefined = session?.user.roles
     const canWrite = roles?.includes('ADMIN') || roles?.includes('PRODUCT_WRITE');
  return (
 <ProductPageClient 
     allProductsData={allProducts.data} 
     canWrite={canWrite} 
   />
  )
}
