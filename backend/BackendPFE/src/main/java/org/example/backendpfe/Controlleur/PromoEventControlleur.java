package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Promo;
import org.example.backendpfe.ServiceImpl.PromoService;
import org.example.backendpfe.repository.PromoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/event")
public class PromoEventControlleur {

    @Autowired
    private PromoService promoService;
    @Autowired
    private PromoRepo promoRepo;

    @PostMapping("/createEvent")
    public Promo createEvent(@RequestBody Promo promo) {
        return promoService.promote(promo);
    }
    @GetMapping("/GetEvent")
    public List<Promo> getEvent(@RequestParam(required = false, defaultValue = "en") String lang) {
        List<Promo> promo = promoRepo.findAll();
        List<Promo> translatedEvents = promo.stream().map(event -> {
            Promo translatedEvent = new Promo();
            translatedEvent.setId(event.getId());
            translatedEvent.setEventDate(event.getEventDate());
            switch (lang) {
                case "fr":
                    translatedEvent.setEventTitleFr(event.getEventTitleFr());
                    translatedEvent.setEventDescriptionFr(event.getEventDescriptionFr());
                    break;
                case "ar":
                   translatedEvent.setEventTitleAr(event.getEventTitleAr());
                   translatedEvent.setEventDescriptionAr(event.getEventDescriptionAr());
                    break;
                default:
                    translatedEvent.setEventTitle(event.getEventTitle());
                    translatedEvent.setEventDescription(event.getEventDescription());
                    break;
            }

            return translatedEvent;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedEvents).getBody();
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Promo> updateEvent(@PathVariable Long id, @RequestBody Promo promo) {
        Promo oldPromo = promoService.getPromo(id);
        if (oldPromo != null) {
            oldPromo.setEventTitle(promo.getEventTitle());
            oldPromo.setEventDescription(promo.getEventDescription());
            oldPromo.setEventDate(promo.getEventDate());
            Promo updatedPromo = promoService.promote(oldPromo);
            return ResponseEntity.ok(updatedPromo);
        }
        return ResponseEntity.notFound().build();
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        Promo existpromo = promoService.getPromo(id);
        if (existpromo != null) {
            promoService.deletePromo(id);
            return ResponseEntity.ok("event is deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
