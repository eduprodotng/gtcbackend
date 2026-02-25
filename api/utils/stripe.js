const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createConnectedAccount = async (email) => {
  try {
    const account = await stripe.accounts.create({
      country: "GB",
      email: email,
      business_type: "individual",
      capabilities: {
        transfers: { requested: true }, // Enable payouts
      },
      controller: {
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });

    console.log("Connected Account Created:", account.id);
    return account;
  } catch (error) {
    console.error("Error creating connected account:", error);
    //return false
    throw error;
  }
};

// const generateAccountLink = async (account) => {
//   try {
//     const accountLink = await stripe.accountLinks.create({
//       account: account,
//       return_url: `https://skilloviaweb.vercel.app/success-pay/${account}`,
//       refresh_url: `https://skilloviaweb.vercel.app/failure-pay/${account}`,
//       type: "account_onboarding",
//     });
//     //   try {
//     //     const baseUrl = process.env.BASE_URL || "https://skilloviaweb.vercel.app";

//     //     const accountLink = await stripe.accountLinks.create({
//     //       account: account,
//     //       return_url: `${baseUrl}/success-pay/${account}`,
//     //       refresh_url: `${baseUrl}/failure-pay/${account}`,
//     //       type: "account_onboarding",
//     //     });

//     //     console.log("Account Link:", accountLink);
//   } catch (error) {
//     console.error(
//       "An error occurred when calling the Stripe API to create an account link:",
//       error
//     );
//     throw error.message;
//   }
// };
const generateAccountLink = async (account) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: account,
      return_url: `https://skilloviaweb.vercel.app/success-pay`,
      refresh_url: `https://skilloviaweb.vercel.app/failure-pay`,
      type: "account_onboarding",
    });

    console.log("Generated Account Link:", accountLink);

    return accountLink; // ✅ Ensure the function returns the account link
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error
    );
    throw error; // ✅ Return the full error object instead of just `error.message`
  }
};
// const processSplitPayment = async (
//   customerEmail,
//   amount,
//   currency,
//   connectedAccountId
// ) => {
//   try {
//     // Calculate platform fee (4% of the total amount)
//     const platformFee = Math.floor(amount * 0.04 * 100); // Convert to cents
//     const totalAmount = amount * 100 + platformFee;

//     // Create a Payment Intent with destination charge and application fee
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: currency,
//       payment_method_types: ["card"],
//       receipt_email: customerEmail,
//       application_fee_amount: platformFee,
//       transfer_data: {
//         destination: connectedAccountId, // The vendor's Stripe account ID
//       },
//     });

//     console.log("Payment Intent Created:", paymentIntent.id);
//     return paymentIntent.client_secret;
//   } catch (error) {
//     console.error("Error processing split payment:", error);
//     throw error;
//   }
// };

// const processSplitPayment = async (
//   customerEmail,
//   amount,
//   currency,
//   connectedAccountId
// ) => {
//   try {
//     // Convert amount to cents (Stripe uses smallest currency units)
//     const amountInCents = Math.floor(amount * 100);

//     // Calculate platform fee (4% of the total amount)
//     const platformFee = Math.floor(amountInCents * 0.04);

//     // Create a Payment Intent with destination charge and application fee
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents, // ✅ This is the total amount paid by the customer
//       currency: currency,
//       payment_method_types: ["card"],
//       receipt_email: customerEmail,
//       application_fee_amount: platformFee, // ✅ This is the 4% fee taken by the platform
//       transfer_data: {
//         destination: connectedAccountId, // ✅ The vendor's Stripe account ID
//       },
//     });

//     console.log("Payment Intent Created:", paymentIntent.id);
//     return paymentIntent.client_secret;
//   } catch (error) {
//     console.error("Error processing split payment:", error);
//     throw error;
//   }
// };
// const processSplitPayment = async (
//   customerEmail,
//   amount,
//   currency,
//   connectedAccountId
// ) => {
//   try {
//     // Debugging: Log the received amount before processing
//     console.log("Received amount from frontend:", amount);

//     // Ensure the amount is correctly interpreted as GBP (£)
//     const amountInCents = Math.floor(amount * 100); // Convert GBP to pence (e.g., £9 → 900p)
//     console.log("Converted amount to pence (smallest unit):", amountInCents);

//     // Calculate platform fee (4% of the total amount)
//     const platformFee = Math.floor(amountInCents * 0.04);
//     console.log("Calculated platform fee (4%):", platformFee);

//     // Create a Payment Intent with destination charge and application fee
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents, // Total amount in pence
//       currency: currency, // Ensure currency is GBP
//       payment_method_types: ["card"],
//       receipt_email: customerEmail,
//       application_fee_amount: platformFee, // Platform fee in pence
//       transfer_data: {
//         destination: connectedAccountId, // Vendor's Stripe account ID
//       },
//     });

//     console.log("✅ Payment Intent Created:", paymentIntent.id);
//     return paymentIntent.client_secret;
//   } catch (error) {
//     console.error("❌ Error processing split payment:", error);
//     throw error;
//   }
// };
const processSplitPayment = async (
  customerEmail,
  amount, // amount in GBP (e.g., 9 for £9)
  currency,
  connectedAccountId
) => {
  try {
    // Debugging: Log the received amount before processing
    console.log("Received amount from frontend:", amount);

    // If the currency is GBP, we need to convert to pence (100) only.
    const amountInCents =
      currency === "gbp" ? Math.floor(amount * 100) : amount;

    console.log("Converted amount to pence (smallest unit):", amountInCents);

    // Calculate platform fee (4% of the total amount)
    const platformFee = Math.floor(amountInCents * 0.04);
    console.log("Calculated platform fee (4%):", platformFee);

    // Create a Payment Intent with destination charge and application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Total amount in pence (e.g., £9 → 900p)
      currency: currency, // Ensure currency is GBP
      payment_method_types: ["card"],
      receipt_email: customerEmail,
      application_fee_amount: platformFee, // Platform fee in pence
      transfer_data: {
        destination: connectedAccountId, // Vendor's Stripe account ID
      },
    });

    console.log("✅ Payment Intent Created:", paymentIntent.id);
    return paymentIntent.client_secret;
  } catch (error) {
    console.error("❌ Error processing split payment:", error);
    throw error;
  }
};

const createWalletFundingIntent = async (
  customerEmail,
  amountInPounds,
  currency
) => {
  try {
    const amountInCents = Math.floor(amountInPounds * 100); // convert to pence
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method_types: ["card"],
      receipt_email: customerEmail,
    });

    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Error creating wallet funding intent:", error);
    throw error;
  }
};

module.exports = {
  createConnectedAccount,
  generateAccountLink,
  processSplitPayment,
  createWalletFundingIntent,
};
