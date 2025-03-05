import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

const OtpEmail: React.FC<OtpEmailProps> = ({ otp }) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Heading
            style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
          >
            Email Verification
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            Thank you for signing up! Please use the OTP below to verify your
            email address:
          </Text>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "20px 0",
              color: "#007BFF",
            }}
          >
            {otp}
          </Text>
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#777",
              textAlign: "center",
            }}
          >
            This OTP is valid for 10 minutes. If you did not request this,
            please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OtpEmail;