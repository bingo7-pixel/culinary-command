export interface Order {
  id: string;
  customerName: string;
  type: "dine-in" | "takeout" | "delivery";
  status: "completed" | "canceled" | "refunded";
  totalAmount: number;
  orderDate: Date;
  items: string[];
  notes?: string;
  paymentMethod: string;
}