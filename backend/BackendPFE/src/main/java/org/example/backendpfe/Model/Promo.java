package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
public class Promo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String  eventTitle;
    private String  eventTitleAr;
    private String eventTitleFr;
    private String  eventDescription;
    private String  eventDescriptionAr;
    private String  eventDescriptionFr;

    private Date eventDate;


    public Promo() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventTitleAr() {
        return eventTitleAr;
    }

    public void setEventTitleAr(String eventTitleAr) {
        this.eventTitleAr = eventTitleAr;
    }

    public String getEventTitleFr() {
        return eventTitleFr;
    }

    public void setEventTitleFr(String eventTitleFr) {
        this.eventTitleFr = eventTitleFr;
    }

    public String getEventDescriptionAr() {
        return eventDescriptionAr;
    }

    public void setEventDescriptionAr(String eventDescriptionAr) {
        this.eventDescriptionAr = eventDescriptionAr;
    }

    public String getEventDescriptionFr() {
        return eventDescriptionFr;
    }

    public void setEventDescriptionFr(String eventDescriptionFr) {
        this.eventDescriptionFr = eventDescriptionFr;
    }
}
