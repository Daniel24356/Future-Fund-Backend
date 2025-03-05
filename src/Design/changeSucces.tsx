import React from "react";
import {
 Html,
 Head,
 Body,
 Container,
 Heading,
 Text,
} from "@react-email/components";


interface ChangePasswordProps {
 to: string; 
 subject: string;
 name: string;
}


const ChangePassword: React.FC<ChangePasswordProps> = ({ name }) => {
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
           We're here to inform you that the old password
           has been changed to the new one.
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


export default ChangePassword;