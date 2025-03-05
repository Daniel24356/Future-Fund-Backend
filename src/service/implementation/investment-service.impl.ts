import { Investment } from "@prisma/client";
import { InvestDTO } from "../../dto/invest.dto";
import { InvestmentService } from "../investment.service";


export class InvestmentServiceImpl implements InvestmentService{
    invest(data: InvestDTO): Promise<Investment> {
        throw new Error("Method not implemented.");
    }
    getUserInvestments(userId: string): Promise<Investment[]> {
        throw new Error("Method not implemented.");
    }
    
}