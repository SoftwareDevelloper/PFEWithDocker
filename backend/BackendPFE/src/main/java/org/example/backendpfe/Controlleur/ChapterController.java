package org.example.backendpfe.Controlleur;

import org.example.backendpfe.DTO.Chapters;
import org.example.backendpfe.DTO.QuestionDTO;
import org.example.backendpfe.Model.Chapter;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Questions;
import org.example.backendpfe.ServiceImpl.ChapterService;
import org.example.backendpfe.ServiceImpl.VideoUploadService;
import org.example.backendpfe.ServiceImpl.filesUploadService;
import org.example.backendpfe.repository.ChapterRepository;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("api/chapters")
public class ChapterController {
    private final ChapterService chapterService;
    private final VideoUploadService videoUploadService;
    private final org.example.backendpfe.ServiceImpl.filesUploadService filesUploadService;
    private final ChapterRepository chapterRepository;

    public ChapterController(ChapterService chapterService, VideoUploadService videoUploadService, filesUploadService filesUploadService, ChapterRepository chapterRepository) {
        this.chapterService = chapterService;
        this.videoUploadService = videoUploadService;
        this.filesUploadService = filesUploadService;
        this.chapterRepository = chapterRepository;
    }

    @PostMapping("/upload_video")
    public ResponseEntity<Map<String, String>> uploadVideo(@RequestParam("video") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is missing"));
        }
        try {
            String videoUrl = videoUploadService.uploadVideo(file);
            return ResponseEntity.ok(Map.of("videoUrl", "http://localhost:9000" + videoUrl));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }
    @PostMapping("/upload_files")
    public ResponseEntity<Map<String, String>> uploadfiles(@RequestParam("pdf") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please select a PDF file"));
            }

            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are allowed"));
            }

            // Call service to upload the file and save the generated UUID
            Map<String, String> result = filesUploadService.uploadfiles(file);  // Upload file and return UUID

            // Store the UUID in the response
            return ResponseEntity.ok(Map.of(
                    "savedFileName", result.get("savedFileName"),  // Real saved name (UUID.pdf)
                    "originalFileName", file.getOriginalFilename() // Original file name
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }


    @PostMapping("Addchapters/{formationId}")
    public Chapter addChapter(@PathVariable Long formationId, @RequestBody Chapter chapter) {
        return chapterService.addChapterToFormation(formationId, chapter);
    }

    @GetMapping("/formation/{formationId}")
    public List<Chapter> getFormationChapters(@PathVariable Long formationId) {
        return chapterService.getChaptersByFormation(formationId);
    }
    @GetMapping("/Chapters")
    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    @PutMapping("/{chapterId}")
    public Chapter updateChapter(@PathVariable Long chapterId, @RequestBody Chapter chapter) {
        return chapterService.updateChapter(chapterId, chapter);
    }

    @DeleteMapping("/{chapterId}")
    public void deleteChapter(@PathVariable Long chapterId) {
        chapterService.deleteChapter(chapterId);
    }


    @GetMapping("/download-cours/{chapterId}")
    public ResponseEntity<Resource> downloadChapterCours(@PathVariable Long chapterId) {
        try {
            Chapter chapter = chapterRepository.findById(chapterId)
                    .orElseThrow(() -> new RuntimeException("Chapter not found"));

            if (chapter.getPdfCours() == null) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = filesUploadService.loadfiles(chapter.getPdfCours());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace(); // log the actual error to the console
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/download-td/{chapterId}")
    public ResponseEntity<Resource> downloadChapterTD(@PathVariable Long chapterId) {
        try {
            Chapter chapter = chapterRepository.findById(chapterId)
                    .orElseThrow(() -> new RuntimeException("Chapter not found"));

            if (chapter.getPdfTD() == null) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = filesUploadService.loadfiles(chapter.getPdfTD());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace(); // log the actual error to the console
            return ResponseEntity.internalServerError().body(null);
        }
    }


    @PostMapping("/create")
    public ResponseEntity<?> createChapters(@RequestBody Chapters chapters) {
        if (chapters.getFormation_id() == null) {
            return ResponseEntity.badRequest().body("Formation ID is required");
        }

        Chapter chapter = new Chapter();
        chapter.setTitleEn(chapters.getTitleEn());
        chapter.setTitleFr(chapters.getTitleFr());
        chapter.setTitleAr(chapters.getTitleAr());
        chapter.setDescriptionEn(chapters.getDescriptionEn());
        chapter.setDescriptionFr(chapters.getDescriptionFr());
        chapter.setDescriptionAr(chapters.getDescriptionAr());
        chapter.setVideoUrl(chapters.getVideoUrl());
        chapter.setPrice(chapters.getPrice());
        chapter.setPdfCours(chapters.getPdfCours());
        chapter.setPdfTD(chapters.getPdfTD());

        // Create a minimal formation object with just the ID
        Formations formation = new Formations();
        formation.setId(chapters.getFormation_id());
        chapter.setFormation(formation);

        chapterService.addChaptersToFormation(chapter);
        return ResponseEntity.ok(chapter);
    }

}
