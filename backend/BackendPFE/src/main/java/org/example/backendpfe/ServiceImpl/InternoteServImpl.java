package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Service.InternoteServ;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class InternoteServImpl implements InternoteServ
{
    @Autowired
    private InternoteRepo repo;
    @Autowired
    private InternoteRepo internoteRepo;

    @Override
    public Internote getInternoteById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Internote not found with id: " + id));
    }


    @Override
    public Internote getInternoteByname(String fullname) {
        return repo.findByName(fullname);
    }

    @Override
    public Internote createInternote(Internote internote) {
        return repo.save(internote);
    }

    @Override
    public Internote updateInternote(Internote internote) {
        return repo.save(internote);
    }

    @Override
    public void deleteInternote(Internote internote) {
        repo.delete(internote);
    }

    @Override
    public List<Internote> getAllInternotes() {

        return repo.findAll();
    }

    @Override
    public Internote findByemail(String email)
    {
        return repo.existByemail(email);
    }
    public Internote assignEnseignantToApprenant(Long apprenantId, Long enseignantId) {
        Internote apprenant = repo.findById(apprenantId).orElseThrow(() -> new RuntimeException("Apprenant not found"));
        Internote enseignant = repo.findById(enseignantId).orElseThrow(() -> new RuntimeException("Enseignant not found"));

        if (apprenant.getRole() != Internote.Role.APPRENANT || enseignant.getRole() != Internote.Role.ENSEIGNMENT) {
            throw new RuntimeException("Invalid role assignment");
        }

        apprenant.getEnseignants().add(enseignant);
        enseignant.getApprenants().add(apprenant);
        repo.save(apprenant);
        repo.save(enseignant);

        return apprenant;
    }
    public Set<Internote> getApprenantsByEnseignant(Long enseignantId) {
        Internote enseignant = repo.findById(enseignantId).orElseThrow(() -> new RuntimeException("Enseignant not found"));
        return enseignant.getApprenants();
    }
    public Set<Internote> getEnseignantsByApprenant(Long apprenantId) {
        Internote apprenant = repo.findById(apprenantId).orElseThrow(() -> new RuntimeException("Apprenant not found"));
        return apprenant.getEnseignants();
    }


    public void updateActive(Internote internote)
    {
        Internote existingInternote = internoteRepo.existByemail(internote.getEmail());
        existingInternote.setActive(true);
        internoteRepo.save(existingInternote);

    }




}
