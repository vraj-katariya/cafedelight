import { Component, OnInit, Input } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order-bill',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './order-bill.component.html',
  styleUrls: ['./order-bill.component.css']
})
export class OrderBillComponent implements OnInit {
  @Input() orderItems: OrderItem[] = [];
  @Input() customerName: string = '';
  @Input() customerPhone: string = '';
  @Input() tableNumber: string = '';
  @Input() orderType: string = 'Dine-in';
  @Input() paymentMethod: string = 'Cash';
  @Input() transactionId: string = '';

  billNumber: string = '';
  currentDate: Date = new Date();
  discount: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.generateBillNumber();
  }

  generateBillNumber(): void {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    this.billNumber = `BILL${timestamp}${random}`;
  }

  get subtotal(): number {
    return this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get cgst(): number {
    return this.subtotal * 0.09;
  }

  get sgst(): number {
    return this.subtotal * 0.09;
  }

  get totalAmount(): number {
    return this.subtotal + this.cgst + this.sgst - this.discount;
  }

  printBill(): void {
    const printContent = document.getElementById('billPrint');
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printStyles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .bill-container { max-width: 600px; margin: 0 auto; }
        .bill-actions { display: none; }
        .bill-header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .customer-info, .payment-info { margin: 20px 0; }
        .order-items { margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f5f5f5; }
        .bill-summary { margin: 20px 0; }
        .summary-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .summary-row.total { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; }
        .bill-footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
        @media print { body { margin: 0; } }
      </style>
    `;

    document.body.innerHTML = printStyles + printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;

    // Reinitialize the component
    window.location.reload();
  }

  downloadBill(): void {
    const billContent = this.generateBillText();
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill_${this.billNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  shareBill(): void {
    const billContent = this.generateBillText();

    if (navigator.share) {
      navigator.share({
        title: `The Coffee Culture - Bill ${this.billNumber}`,
        text: billContent
      }).catch(err => console.log('Share failed:', err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(billContent).then(() => {
        alert('Bill details copied to clipboard!');
      }).catch(err => {
        console.log('Clipboard copy failed:', err);
        alert('Could not share bill. Please try downloading instead.');
      });
    }
  }

  generateBillText(): string {
    let text = `THE COFFEE CULTURE - ORDER BILL\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Bill No: ${this.billNumber}\n`;
    text += `Date: ${this.currentDate.toLocaleDateString()}\n`;
    text += `Table: ${this.tableNumber || 'Takeaway'}\n\n`;

    text += `CUSTOMER INFORMATION\n`;
    text += `${'-'.repeat(25)}\n`;
    text += `Name: ${this.customerName}\n`;
    text += `Phone: ${this.customerPhone}\n`;
    text += `Order Type: ${this.orderType}\n\n`;

    text += `ORDER DETAILS\n`;
    text += `${'-'.repeat(25)}\n`;
    this.orderItems.forEach(item => {
      text += `${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });

    text += `\nBILL SUMMARY\n`;
    text += `${'-'.repeat(25)}\n`;
    text += `Subtotal: ₹${this.subtotal.toFixed(2)}\n`;
    text += `CGST (9%): ₹${this.cgst.toFixed(2)}\n`;
    text += `SGST (9%): ₹${this.sgst.toFixed(2)}\n`;
    if (this.discount > 0) {
      text += `Discount: -₹${this.discount.toFixed(2)}\n`;
    }
    text += `TOTAL: ₹${this.totalAmount.toFixed(2)}\n\n`;

    text += `PAYMENT INFORMATION\n`;
    text += `${'-'.repeat(25)}\n`;
    text += `Payment Method: ${this.paymentMethod}\n`;
    text += `Status: PAID\n`;
    text += `Transaction ID: ${this.transactionId}\n\n`;

    text += `Thank you for visiting The Coffee Culture!\n`;
    text += `Visit us again soon!\n`;

    return text;
  }
}
