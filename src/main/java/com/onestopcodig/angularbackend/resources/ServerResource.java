package com.onestopcodig.angularbackend.resources;

import com.onestopcodig.angularbackend.models.Response;
import com.onestopcodig.angularbackend.models.Server;
import com.onestopcodig.angularbackend.services.ServerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import static com.onestopcodig.angularbackend.enumerations.Status.SERVER_UP;
import static org.springframework.http.HttpStatus.CREATED;
import static  org.springframework.http.HttpStatus.OK;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/servers")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200","http://localhost:3000"}, allowCredentials = "true")
public class ServerResource {
    private final ServerService serverService;

    @GetMapping("/list")
    public ResponseEntity<Response> getServers() {
         return ResponseEntity.ok(Response.builder()
                .timestamp(now())
                .data(Map.of("Servers", serverService.list(30)))
                .message("servers retrieved")
                .status(OK)
                .statusCode(OK.value())
                .build());
    }


    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<Response> pingServer(@PathVariable("ipAddress") String ipAddress) throws IOException{
        Server server = serverService.ping(ipAddress);
        return ResponseEntity.ok(Response.builder()
                .timestamp(now())
                .data(Map.of("Server", server))
                .message(server.getStatus() == SERVER_UP ? "ping successful" : "Server Offline")
                .status(OK)
                .statusCode(OK.value())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> fetchServer(@PathVariable("id") long id) {
        Server server = serverService.get(id);
        return ResponseEntity.ok(Response.builder()
                .timestamp(now())
                .data(Map.of("server", server))
                .message(server.getName() != null ? "server retrieved" : "server not found")
                .status(OK)
                .statusCode(OK.value())
                .build());
    }

    @GetMapping(path = "/images/{filename}", produces = IMAGE_PNG_VALUE)
    byte[] getServerImage(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home") + "/downloads/images/" + filename));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(Response.builder()
                .timestamp(now())
                .data(Map.of("Servers", serverService.create(server)))
                .message("new server created")
                .status(CREATED)
                .statusCode(CREATED.value())
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> saveServer(@PathVariable("id") long id) {
        return ResponseEntity.ok(Response.builder()
                .timestamp(now())
                .data(Map.of("deleted", serverService.delete(id)))
                .message("Deleted server with id: " + id )
                .status(OK)
                .statusCode(OK.value())
                .build());
    }
}
