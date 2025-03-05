import React from "react";
import {
 Html,
 Head,
 Body,
 Container,
 Heading,
 Text,
} from "@react-email/components";


interface WelcomeEmailProps {
 name: string;
}


const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
 return (
   <Html>
     <Head />
     <Body
       style={{
         fontFamily: "Arial, sans-serif",
         padding: "20px",
         backgroundColor: "#f4f4f4",
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
           style={{
             color: "#333",
             textAlign: "center",
             marginBottom: "20px",
             fontSize: "28px",
           }}
         >
           Welcome to Futurerify.
         </Heading>
         <Text
           style={{
             fontSize: "16px",
             lineHeight: "1.5",
             color: "#333",
             marginBottom: "20px",
           }}
         >
           Hello <strong>{name}</strong>,
         </Text>
         <Text
           style={{
             fontSize: "16px",
             lineHeight: "1.5",
             color: "#333",
             marginBottom: "20px",
           }}
         >
           We're excited to have you join us. Our platform is designed to make
           your experience seamless and productive. Here, you can explore
           amazing features and make the most out of your journey with us.
         </Text>
         <Text
           style={{
             fontSize: "14px",
             lineHeight: "1.5",
             color: "#777",
             marginBottom: "20px",
           }}
         >
           If you have any questions or need assistance, feel free to reach
           out to our support team. We're here to help!
         </Text>
         <Text
           style={{
             fontSize: "14px",
             lineHeight: "1.5",
             color: "#777",
             textAlign: "center",
           }}
         >
           Thank you for choosing us. We're thrilled to have you on board!
         </Text>
       </Container>
     </Body>
   </Html>
 );
};


export default WelcomeEmail;