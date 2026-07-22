process.env.NEXT_PUBLIC_SITE_URL = "https://bhutanupwardtravels.com";
import { emailTemplates } from "./src/lib/email/templates";
import fs from "fs";

const sample: any = {
  _id: "abc123",
  firstName: "Sonam",
  lastName: "Wangchuk",
  email: "sonam@example.com",
  phone: "+975 17 123 456",
  destination: "Paro Valley",
  travelDate: "2026-09-12",
  travelers: "2 Adults",
  message: "Would love a cultural + trekking mix, mid-range hotels.",
  tourName: "Bhutan Cultural Explorer",
  status: "pending",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

fs.writeFileSync(`/private/tmp/claude-501/-Users-tenzinkhorlo-Desktop-personal-web-tourism/094784c2-7f08-429f-a01d-a3c81ca9c1b7/scratchpad/preview-userConfirmation.html`, emailTemplates.userConfirmation(sample));
fs.writeFileSync(`/private/tmp/claude-501/-Users-tenzinkhorlo-Desktop-personal-web-tourism/094784c2-7f08-429f-a01d-a3c81ca9c1b7/scratchpad/preview-operatorNotification.html`, emailTemplates.operatorNotification(sample));
fs.writeFileSync(`/private/tmp/claude-501/-Users-tenzinkhorlo-Desktop-personal-web-tourism/094784c2-7f08-429f-a01d-a3c81ca9c1b7/scratchpad/preview-requestApproved.html`, emailTemplates.requestApproved(sample));
fs.writeFileSync(`/private/tmp/claude-501/-Users-tenzinkhorlo-Desktop-personal-web-tourism/094784c2-7f08-429f-a01d-a3c81ca9c1b7/scratchpad/preview-requestRejected.html`, emailTemplates.requestRejected(sample));
console.log("done");
