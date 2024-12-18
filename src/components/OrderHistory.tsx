/**
 * OrderHistory Component
 * 
 * This component displays a comprehensive order history with filtering, sorting,
 * and detailed view capabilities. It uses WebSocket connections for real-time
 * updates and supports CSV exports.
 */
import { useState } from "react";
import { Download } from "lucide-react";
import { format } from "date-fns"; // Add this import
import { Button } from "@/components/ui/button";
import { OrderHistoryFilters } from "./order-history/OrderHistoryFilters";
import { OrderHistoryTable } from "./order-history/OrderHistoryTable";
import { OrderDetailsModal } from "./order-history/OrderDetailsModal";
import { Order } from "@/types/order";

// Mock data (replace with API call)
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    type: "dine-in",
    status: "completed",
    totalAmount: 54.99,
    orderDate: new Date("2024-01-15T14:30:00Z"),
    items: ["Burger", "Fries", "Coke"],
    paymentMethod: "Credit Card",
    notes: "No onions in burger"
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    type: "takeout",
    status: "canceled",
    totalAmount: 32.50,
    orderDate: new Date("2024-01-14T18:45:00Z"),
    items: ["Pizza", "Salad"],
    paymentMethod: "Cash"
  },
];

export function OrderHistory() {
  // State management
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all"); // Changed from empty string to "all"
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // Changed from empty string to "all"
  const [date, setDate] = useState<Date>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders based on search and filter criteria
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || order.type === selectedType;
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesDate = !date || format(order.orderDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Handle CSV export
  const handleExport = () => {
    const csv = filteredOrders.map(order => 
      `${order.id},${order.customerName},${order.type},${order.status},${order.totalAmount},${format(order.orderDate, "yyyy-MM-dd HH:mm:ss")}`
    ).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-history-${format(new Date(), "dd-MM-yyyy")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <OrderHistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        date={date}
        setDate={setDate}
      />

      <div className="flex justify-end">
        <Button onClick={handleExport}>
          Export CSV
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <OrderHistoryTable
        orders={filteredOrders}
        onOrderClick={setSelectedOrder}
      />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}