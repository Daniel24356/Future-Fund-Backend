import { BillPayment } from "@prisma/client";
import { PayBillDTO } from "../dto/paybill.dto";

export interface BillPaymentService {
  payBill(data: PayBillDTO): Promise<BillPayment>;
  getUserBillPayments(userId: string): Promise<BillPayment[]>;
}
