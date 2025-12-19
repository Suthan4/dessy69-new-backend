import { AppConfig } from "@/config/app.config";
import axios from "axios";

async function testSMSSimple() {
  const API_KEY = process.env.FAST2SMS_API_KEY;

  console.log("🔑 API Key loaded:", API_KEY ? "Yes" : "No");
  console.log("📱 Testing Fast2SMS...\n");

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: "Test message from Dessy69",
        language: "english",
        flash: 0,
        numbers: "9080782925",
      },
      {
        headers: {
          authorization: AppConfig.fast2sms.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Success! Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error("❌ Error:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data);
    console.error("Full error:", error.message);
  }
}

testSMSSimple();
