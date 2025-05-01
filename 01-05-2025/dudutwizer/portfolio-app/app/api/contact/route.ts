import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Email validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate form data
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, message } = result.data;
    
    // In a real application, you would use environment variables for these
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "user@example.com",
        pass: process.env.EMAIL_PASSWORD || "password",
      },
    });
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || "portfolio@example.com",
      to: process.env.EMAIL_TO || "your-email@example.com",
      subject: `Portfolio Contact: Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };
    
    // For demo purposes, we'll just log the email content instead of sending it
    console.log("Email would be sent with:", mailOptions);
    
    // In a production environment, uncomment this to actually send the email
    // await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}