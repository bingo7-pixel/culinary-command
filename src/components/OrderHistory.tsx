import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  customerName: string;
  type: "dine-in" | "takeout" | "delivery";
  status: "completed" | "canceled" | "refunded";
  totalAmount: number;
  orderDate: Date;
  items: string[];
  notes?: string;
  paymentMethod: string;
};

// Mock data
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
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || order.type === selectedType;
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    const matchesDate = !date || format(order.orderDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search by Order ID or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="dine-in">Dine-in</SelectItem>
              <SelectItem value="takeout">Takeout</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[150px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {(searchTerm || selectedType || selectedStatus || date) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("");
                setSelectedStatus("");
                setDate(undefined);
              }}
            >
              Clear Filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Button onClick={handleExport}>
            Export CSV
            <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Order Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="capitalize">{order.type}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      {
                        "bg-green-100 text-green-800": order.status === "completed",
                        "bg-red-100 text-red-800": order.status === "canceled",
                        "bg-yellow-100 text-yellow-800": order.status === "refunded",
                      }
                    )}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{format(order.orderDate, "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div className="bg-card p-6 rounded-lg max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Order ID:</span> {selectedOrder.id}</p>
              <p><span className="font-semibold">Customer:</span> {selectedOrder.customerName}</p>
              <p><span className="font-semibold">Items:</span></p>
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p><span className="font-semibold">Payment Method:</span> {selectedOrder.paymentMethod}</p>
              {selectedOrder.notes && (
                <p><span className="font-semibold">Notes:</span> {selectedOrder.notes}</p>
              )}
            </div>
            <Button className="mt-4 w-full" onClick={() => setSelectedOrder(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}