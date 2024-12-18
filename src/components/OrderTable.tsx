import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Order = {
  id: string;
  type: "dine-in" | "takeout" | "delivery";
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  prepTime: number;
  elapsedTime: number;
  customerName: string;
  items: string[];
};

// Temporary mock data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    type: "dine-in",
    status: "in-progress",
    priority: "high",
    prepTime: 30,
    elapsedTime: 25,
    customerName: "John Doe",
    items: ["Burger", "Fries", "Coke"],
  },
  {
    id: "ORD-002",
    type: "takeout",
    status: "pending",
    priority: "medium",
    prepTime: 20,
    elapsedTime: 5,
    customerName: "Jane Smith",
    items: ["Pizza", "Salad"],
  },
];

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getProgressColor = (prepTime: number, elapsedTime: number) => {
    const percentage = (elapsedTime / prepTime) * 100;
    if (percentage > 100) return "bg-red-500";
    if (percentage > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search orders..."
          className="px-4 py-2 border rounded-lg bg-dashboard-card text-white border-gray-600 focus:outline-none focus:border-dashboard-accent2"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-dashboard-background"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell>{order.id}</TableCell>
              <TableCell className="capitalize">{order.type}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    {
                      "bg-yellow-500/20 text-yellow-500": order.status === "pending",
                      "bg-blue-500/20 text-blue-500": order.status === "in-progress",
                      "bg-green-500/20 text-green-500": order.status === "completed",
                      "bg-red-500/20 text-red-500": order.status === "overdue",
                    }
                  )}
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    {
                      "bg-green-500/20 text-green-500": order.priority === "low",
                      "bg-yellow-500/20 text-yellow-500": order.priority === "medium",
                      "bg-red-500/20 text-red-500": order.priority === "high",
                    }
                  )}
                >
                  {order.priority}
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full">
                  <Progress
                    value={(order.elapsedTime / order.prepTime) * 100}
                    className={cn("h-2", getProgressColor(order.prepTime, order.elapsedTime))}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(order.id, "completed");
                    }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-dashboard-card border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to cancel this order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleStatusUpdate(order.id, "overdue")}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div className="bg-dashboard-card p-6 rounded-lg max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Order Details</h3>
            <div className="space-y-2 text-gray-300">
              <p><span className="font-semibold">Customer:</span> {selectedOrder.customerName}</p>
              <p><span className="font-semibold">Items:</span></p>
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p><span className="font-semibold">Prep Time:</span> {selectedOrder.prepTime} minutes</p>
              <p><span className="font-semibold">Elapsed Time:</span> {selectedOrder.elapsedTime} minutes</p>
            </div>
            <Button className="mt-4 w-full" onClick={() => setSelectedOrder(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}