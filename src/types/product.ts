export interface VariantBenefit {
  id: number
  text: string
}

export interface ProductVariant {
  id: number
  product: number
  name: string
  description: string
  price: number
  stock: number
  is_active: boolean
  benefits: VariantBenefit[]
}

export interface Product {
  id: number
  name: string
  description: string
  is_active: boolean
  variants: ProductVariant[]
}
