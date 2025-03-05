import { BillPayment } from "@prisma/client";
import { PayBillDTO } from "../../dto/payBill.dto";
import { BillPaymentService } from "../billpayment.service";


export class BillPaymentServiceImpl implements BillPaymentService{
    payBill(data: PayBillDTO): Promise<BillPayment> {
        throw new Error("Method not implemented.");
    }
    getUserBillPayments(userId: string): Promise<BillPayment[]> {
        throw new Error("Method not implemented.");
    }
    
}