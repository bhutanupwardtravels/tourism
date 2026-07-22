import { sendMail, senders } from "../src/lib/mail";
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

    const operatorEmail = process.env.OPERATOR_EMAIL || "mahbus.dev@gmail.com";

    console.log("1. Testing User Confirmation Email...");
    const userResult = await sendMail({
        to: mockData.email,
        subject: "TEST: Your Tour Request - Bhutan Upward Travels",
        html: emailTemplates.userConfirmation(mockData as any),
        from: senders.confirmation(),
        replyTo: operatorEmail,
    });
    console.log("User email result:", userResult);

    console.log("\n2. Testing Operator Notification Email...");
    const operatorResult = await sendMail({
        to: operatorEmail,
        subject: "TEST: New Tour Request Notification",
        html: emailTemplates.operatorNotification(mockData as any),
        from: senders.operatorNotification(),
        replyTo: mockData.email,
    });
    console.log("Operator email result:", operatorResult);

    console.log("\n3. Testing Request Approved Email...");
    const approvedResult = await sendMail({
        to: mockData.email,
        subject: "TEST: Your Tour Request is Approved - Bhutan Upward Travels",
        html: emailTemplates.requestApproved(mockData as any),
        from: senders.approved(),
        replyTo: operatorEmail,
    });
    console.log("Approved email result:", approvedResult);

    console.log("\n4. Testing Request Rejected Email...");
    const rejectedResult = await sendMail({
        to: mockData.email,
        subject: "TEST: Update on Your Tour Request - Bhutan Upward Travels",
        html: emailTemplates.requestRejected(mockData as any),
        from: senders.rejected(),
        replyTo: operatorEmail,
    });
    console.log("Rejected email result:", rejectedResult);

    if (userResult.success && operatorResult.success && approvedResult.success && rejectedResult.success) {
        console.log("\n✅ All tests passed!");
    } else {
        console.log("\n❌ Some tests failed. Check the errors above.");
    }
}


testEmail();
