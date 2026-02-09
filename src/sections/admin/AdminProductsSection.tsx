import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts } from "@/services/apiProduct"
import { updateVariant } from "@/services/apiVariants"
import { ProductVariantCard } from "@/components/admin/ProductVariantCard"

export const AdminProductsSection = () => {
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  })

  const mutation = useMutation({
    mutationFn: ({ id, data }: any) => updateVariant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="space-y-10">
      {products?.map((product: any) => (
        <div key={product.id} className="space-y-6">
          <h3 className="text-2xl font-semibold">{product.name}</h3>

          {product.variants.map((variant: any) => (
            <ProductVariantCard
              key={variant.id}
              variant={variant}
              onSave={(data: any) => 
                mutation.mutate({ id: variant.id, data })
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}
