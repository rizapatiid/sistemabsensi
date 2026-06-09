require('dotenv').config({ path: '.env' });

async function testWA() {
  const token = process.env.FONNTE_TOKEN;
  console.log("Token:", token);
  
  if (!token) {
    console.error("Token missing");
    return;
  }

  // Use a dummy number or the user's number. The user didn't provide their number. 
  // We'll just test if the API accepts the request or returns an authentication error.
  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": token,
      },
      body: new URLSearchParams({
        target: "081234567890", // dummy
        message: "Test message",
      })
    });

    const result = await response.json();
    console.log("Result:", result);
  } catch (e) {
    console.error("Error:", e);
  }
}

testWA();
