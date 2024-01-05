import { Component, OnInit } from '@angular/core';
import { OrderService, Order, OrderResponse, ShippingAddress  } from '../../../assets/service/donhang.service';
import { ProductService, Product } from "../../../assets/service/product.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-donhang',
  templateUrl: './donhang.component.html',
  styleUrls: ['./donhang.component.css']
})
export class DonhangComponent implements OnInit {

  orders: any[] = [];
  selectedStatus!: string;
  orderStatusOptions: string[] = ['chờ xác nhận', 'Đã xác nhận, đang đóng gói', 'Đã đưa cho đơn vị vận chuyển', 'Đơn hàng đang giao đến bạn', 'Giao không thành công', 'Hủy', 'Giao thành công'];
  userId!: string;
  filterDate: string = '';
  filterPhone: string = '';
 

  originalOrders: Order[] = [];
  selectedStatusFilter: string | undefined;


  constructor(private orderService: OrderService, 
    private productService: ProductService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (response: any) => {
        this.orders = response.orders;
        console.log('Orders:', this.orders);
        this.originalOrders = [...this.orders]; // Gán giá trị cho originalOrders
        this.loadProductDetails();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  filteredOrders(): void {
    if (this.isValidPhoneNumber(this.filterPhone)) {
      console.log('filterPhone:', this.filterPhone);
      this.orders = this.originalOrders.filter(order =>
        order.shippingAddress[0].phone.includes(this.filterPhone)
      );
      console.log('Filtered orders:', this.orders);
    } else if (!this.filterPhone) {
      // Nếu ô input trống, hiển thị lại toàn bộ danh sách đơn hàng
      this.orders = [...this.originalOrders];
      console.log('All orders:', this.orders);
    }
  }
  
  
  isValidPhoneNumber(phone: string): boolean {
    // Kiểm tra xem chuỗi có phải là số điện thoại hợp lệ không
    return /^\d{10}$/.test(phone);
  }
  
  
  
  

  loadProductDetails(): void {
    for (const order of this.orders) {
      for (const item of order.items) {
        // For each item in the order, load product details using ProductService
        this.productService.getProductById(item.product).subscribe(
          (product: any) => {
            // Assign product details to the item
            item.productDetails = product;
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  }

  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
  

  getOrderShippingAddress(order: Order): string {

    const shippingAddress = order.shippingAddress[0];
    return `${shippingAddress.address}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.province}, ${shippingAddress.country}`;
  }

  changeOrderStatus(order: Order): void {
    if (!order || !order._id) {
      console.error('Invalid order object or missing order ID. Cannot update order status.');
      return;
    }
  
    const userId = order.user;
    const orderId = order._id;
  
    if (!userId || !orderId) {
      console.error('Missing user ID or order ID. Cannot update order status.');
      return;
    }
  
    console.log('Updating order status for user:', userId);
    console.log('Order ID:', orderId);
    console.log('New status:', this.selectedStatus);
  
    this.orderService.updateOrderStatus(userId, orderId, this.selectedStatus).subscribe(
      (response) => {
        // Handle the response if needed
        console.log('Update successful. Response:', response);
  
        // Nếu bạn muốn cập nhật trạng thái ngay trên giao diện sau khi thay đổi
        // Bạn có thể cập nhật trực tiếp trong mảng orders
        order.status = this.selectedStatus;
      },
      (error) => {
        // Handle errors if needed
        console.error('Error updating order status:', error);
      }
    );
  }
  
  

  filterOrdersByDate(): void {
    if (this.filterDate) {
      this.orders = this.originalOrders.filter((order: Order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === this.filterDate;
      });
    } else {
      this.orders = [...this.originalOrders]; 
    }
  }

  filterOrders(): void {
    if (this.filterDate || this.selectedStatusFilter) {
      this.orders = this.originalOrders.filter((order: Order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        const dateCondition = !this.filterDate || orderDate === this.filterDate;
        const statusCondition = !this.selectedStatusFilter || order.status === this.selectedStatusFilter;
        return dateCondition && statusCondition;
      });
    } else {
      this.orders = [...this.originalOrders]; // Khôi phục danh sách gốc khi không có điều kiện lọc
    }
  }
  
  exportToExcel(): void {
    // Tạo một mảng chứa dữ liệu cho file Excel
    const excelData: any[] = [];
  
    // Thêm header cho file Excel
    const excelHeader = ['Đơn Hàng', 'Ngày tạo', 'Tên', 'Số điện thoại', 'Địa chỉ', 'Tổng giá trị', 'Trạng thái', 'Sản phẩm'];
    excelData.push(excelHeader);
  
    // Thêm dữ liệu từ danh sách đơn hàng
    this.orders.forEach((order: any) => {
      const products = order.items.map((item: any) => `${item.productDetails.productName} (${item.product}) - Số lượng: ${item.quantity}`);
      const row = [
        order._id,
        new Date(order.createdAt).toLocaleDateString(),
        order.shippingAddress[0].fullName,
        order.shippingAddress[0].phone,
        `${order.shippingAddress[0].address}, ${order.shippingAddress[0].ward}, ${order.shippingAddress[0].district}, ${order.shippingAddress[0].province}, ${order.shippingAddress[0].country}`,
        order.totalAmount,
        order.status,
        products.join('\n') // Nối các sản phẩm thành một chuỗi với dấu xuống dòng
      ];
      excelData.push(row);
    });
  
    // Tạo workbook và worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);
  
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách đơn hàng');
  
    // Xuất file Excel
    XLSX.writeFile(workbook, 'danh_sach_don_hang.xlsx');
  }
  
  
  
  
  

}
