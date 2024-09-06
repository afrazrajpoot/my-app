import { BASE_URL } from "@env";
export const fetchPaymentSheetParams = async (currency, amount) => {
  try {
    const response = await fetch(`${BASE_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currency, amount }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return {
      paymentIntent: data.paymentIntent,
      ephemeralKey: data.ephemeralKey,
      customer: data.customer,
    };
  } catch (error) {
    console.error("Error fetching payment sheet params:", error);
    Alert.alert("Network request failed", error.message);
    return null;
  }
};
