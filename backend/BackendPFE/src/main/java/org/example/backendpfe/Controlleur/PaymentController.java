package org.example.backendpfe.Controlleur;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.example.backendpfe.DTO.InscriptionRequest;
import org.example.backendpfe.DTO.StripeResponse;
import org.example.backendpfe.Service.StripeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/v1")
public class PaymentController {
    private StripeService stripeService;

    public PaymentController(StripeService stripeService) {
        this.stripeService = stripeService;
    }
    @PostMapping("/Checkout")
    public ResponseEntity<StripeResponse> checkoutCourse(@RequestBody InscriptionRequest inscriptionRequest) {
        StripeResponse stripeResponse = stripeService.checkoutCourse(inscriptionRequest);
        return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
    }
    @GetMapping("/total-earnings")
    public ResponseEntity<Double> getTotalEarnings() {
        try {
            double totalEarnings = stripeService.getTotalEarnings();
            return ResponseEntity.ok(totalEarnings); // Return the total earnings as a number
        } catch (StripeException e) {
            System.err.println("Error fetching total earnings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0.0); // Return 0.0 in case of error
        }
    }
}
