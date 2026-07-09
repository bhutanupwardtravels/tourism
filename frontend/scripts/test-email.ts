import { sendMail } from "../src/lib/mail";
import { emailTemplates } from "../src/lib/email/templates";
import { RequestStatus } from "../src/app/admin/tour-requests/types";
import dotenv from "dotenv";

dotenv.config();

async function testEmail() {
    console.log("Starting email test...");
    console.log("Using RESEND_API_KEY:", process.env.RESEND_API_KEY ? "(set)" : "(missing)");

    const mockData = {
        _id: "test-id",
        firstName: "John",
        lastName: "Doe",
        email: "subhamchhetri@dhi.bt", // Replace with your test email if needed
        phone: "+975-1234567",
        destination: "Thimphu & Paro",
        travelDate: "2025-05-20",
        travelers: "2 Adults",
        message: "This is a test message from the email verification script.",
        status: RequestStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    console.log("1. Testing User Confirmation Email...");
    const userResult = await sendMail({
        to: mockData.email,
        subject: "TEST: Your Tour Request - Black Tomato Bhutan",
        html: emailTemplates.userConfirmation(mockData as any),
    });
    console.log("User email result:", userResult);

    console.log("\n2. Testing Operator Notification Email...");
    const operatorResult = await sendMail({
        to: process.env.OPERATOR_EMAIL || "mahbus.dev@gmail.com",
        subject: "TEST: New Tour Request Notification",
        html: emailTemplates.operatorNotification(mockData as any),
    });
    console.log("Operator email result:", operatorResult);

    if (userResult.success && operatorResult.success) {
        console.log("\n✅ All tests passed!");
    } else {
        console.log("\n❌ Some tests failed. Check the errors above.");
    }
}

testEmail();
