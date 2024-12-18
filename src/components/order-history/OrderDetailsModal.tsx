import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-card p-6 rounded-lg max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">Order Details</h3>
        <div className="space-y-2">
          <p><span className="font-semibold">Order ID:</span> {order.id}</p>
          <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
          <p><span className="font-semibold">Items:</span></p>
          <ul className="list-disc list-inside">
            {order.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
          {order.notes && (
            <p><span className="font-semibold">Notes:</span> {order.notes}</p>
          )}
        </div>
        <Button className="mt-4 w-full" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}