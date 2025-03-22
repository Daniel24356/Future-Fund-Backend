"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyLoanDTO = void 0;
const class_validator_1 = require("class-validator");
class ApplyLoanDTO {
}
exports.ApplyLoanDTO = ApplyLoanDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000, { message: "Loan amount must be at least 1,000." }),
    __metadata("design:type", Number)
], ApplyLoanDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyLoanDTO.prototype, "homeAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(["Employed", "Self-employed", "Business owner", "Student"], { message: "Invalid employment status." }),
    __metadata("design:type", String)
], ApplyLoanDTO.prototype, "employmentStatus", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(["Married", "Single", "Divorced", "Student"], { message: "Invalid marital status." }),
    __metadata("design:type", String)
], ApplyLoanDTO.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Account statement is required." }),
    (0, class_validator_1.IsString)({ message: "Account statement must be a string (URL)." }),
    __metadata("design:type", String)
], ApplyLoanDTO.prototype, "accountStatement", void 0);
