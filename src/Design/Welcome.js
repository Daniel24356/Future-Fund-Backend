"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const components_1 = require("@react-email/components");
const WelcomeEmail = ({ name }) => {
    return (react_1.default.createElement(components_1.Html, null,
        react_1.default.createElement(components_1.Head, null),
        react_1.default.createElement(components_1.Body, { style: {
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                backgroundColor: "#f4f4f4",
            } },
            react_1.default.createElement(components_1.Container, { style: {
                    maxWidth: "600px",
                    margin: "auto",
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                } },
                react_1.default.createElement(components_1.Heading, { style: {
                        color: "#333",
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "28px",
                    } }, "Welcome to Futurerify."),
                react_1.default.createElement(components_1.Text, { style: {
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#333",
                        marginBottom: "20px",
                    } },
                    "Hello ",
                    react_1.default.createElement("strong", null, name),
                    ","),
                react_1.default.createElement(components_1.Text, { style: {
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#333",
                        marginBottom: "20px",
                    } }, "We're excited to have you join us. Our platform is designed to make your experience seamless and productive. Here, you can explore amazing features and make the most out of your journey with us."),
                react_1.default.createElement(components_1.Text, { style: {
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: "#777",
                        marginBottom: "20px",
                    } }, "If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!"),
                react_1.default.createElement(components_1.Text, { style: {
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: "#777",
                        textAlign: "center",
                    } }, "Thank you for choosing us. We're thrilled to have you on board!")))));
};
exports.default = WelcomeEmail;
