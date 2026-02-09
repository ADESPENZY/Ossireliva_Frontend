interface Props {
  orderId: number;
}

export const OrderCard = ({ orderId }: Props) => {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex justify-between">
      <div>
        <div className="font-semibold">Order #OSR-{12340 + orderId}</div>
        <div className="text-white/60 text-sm">Lavender Calm × 2</div>
      </div>

      <div className="text-right">
        <div className="font-semibold">$99.98</div>
        <span className="text-brand text-sm">Shipped</span>
      </div>
    </div>
  );
};
