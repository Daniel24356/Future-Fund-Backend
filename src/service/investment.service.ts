import { Investment } from "@prisma/client";
import { InvestDTO } from "../dto/invest.dto";

export interface InvestmentService {
  invest(data: InvestDTO): Promise<Investment>;
  getUserInvestments(userId: string): Promise<Investment[]>;
}
