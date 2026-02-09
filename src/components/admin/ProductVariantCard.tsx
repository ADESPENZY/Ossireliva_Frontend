export const ProductVariantCard = ({ variant, onSave }: any) => {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
      <h4 className="text-lg font-semibold">{variant.name}</h4>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <input
          type="number"
          defaultValue={variant.price}
          onBlur={(e) =>
            onSave({ price: Number(e.target.value) })
          }
          className="bg-black border border-white/10 p-2 rounded"
        />

        <input
          type="number"
          defaultValue={variant.stock}
          onBlur={(e) =>
            onSave({ stock: Number(e.target.value) })
          }
          className="bg-black border border-white/10 p-2 rounded"
        />
      </div>
    </div>
  )
}
