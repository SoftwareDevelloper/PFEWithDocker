package org.example.backendpfe.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.example.backendpfe.DTO.InscriptionRequest;
import org.example.backendpfe.DTO.StripeResponse;
import org.example.backendpfe.DTO.paymentRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService
{
    @Value("${stripe.secret-key}")
    private String secretKey;
    public StripeResponse checkoutCourse(InscriptionRequest paymentRequest){
        Stripe.apiKey = secretKey;
        try {
            // Validate required fields
            if (paymentRequest.getAmount() == null || paymentRequest.getCurrency() == null) {
                throw new IllegalArgumentException("Amount and currency are required.");
            }

            // Create a PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount())
                    .setCurrency(paymentRequest.getCurrency().toLowerCase())
                    .setDescription("Payment for course: " + paymentRequest.getTitle())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            // Add debug logging
            System.out.println("Created PaymentIntent ID: " + paymentIntent.getId());
            System.out.println("Client Secret: " + paymentIntent.getClientSecret());
            return StripeResponse.createResponse(
                    "SUCCESS",
                    "PaymentIntent created",
                    paymentIntent.getId(),
                    paymentIntent.getClientSecret()
            );
        } catch (Exception e) {
            System.err.println("Error creating PaymentIntent: " + e.getMessage());
            e.printStackTrace();

            return StripeResponse.createResponse(
                    "ERROR",
                    e.getMessage(),
                    null,
                    null
            );
        }
    }
    public double getTotalEarnings() throws StripeException {
        Stripe.apiKey = secretKey;
        try {
            final double USD_TO_TND_RATE =3.092;
            PaymentIntentListParams params = PaymentIntentListParams.builder()
                    .setLimit(100L)
                    .build();
            PaymentIntentCollection paymentIntents = PaymentIntent.list(params);
            int totalEarnings = 0;

            for (PaymentIntent paymentIntent : paymentIntents.getData()) {
                if ("succeeded".equals(paymentIntent.getStatus())) {
                    // Convert USD cents to TND
                    double usdAmount = paymentIntent.getAmountReceived() / 100.0;  // USD amount
                    double tndAmount = usdAmount * USD_TO_TND_RATE;  // Convert to TND
                    totalEarnings += (int) tndAmount;
                }
            }
            return totalEarnings;
        } catch (StripeException e) {
            System.err.println("StripeException in getTotalEarnings: " + e.getMessage());
            throw e;
        }
    }


}