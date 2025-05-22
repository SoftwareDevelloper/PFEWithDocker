package org.example.backendpfe.repository;

import jakarta.persistence.Id;
import org.example.backendpfe.Model.Chapter;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByFormationIdOrderByChapterOrderAsc(Long formationId);
}
