package com.onestopcodig.angularbackend;

import com.onestopcodig.angularbackend.models.Server;
import com.onestopcodig.angularbackend.repositories.ServerRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static com.onestopcodig.angularbackend.enumerations.Status.SERVER_DOWN;
import static com.onestopcodig.angularbackend.enumerations.Status.SERVER_UP;
import static com.onestopcodig.angularbackend.enumerations.Type.*;

@SpringBootApplication
public class AngularBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AngularBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner run(ServerRepo serverRepo) {
        String baseUrl = "http://localhost:8080/servers/images/";
        return args -> {
            serverRepo.save(new Server(0, "192.168.129.3", "Outlook", "16GB",
                    SERVER_UP, MAIL_SERVER, baseUrl + "mailserver.png"));
            serverRepo.save(new Server(0, "88.221.24.10", "Volvo Cars", "32GB",
                    SERVER_DOWN, WEB_SERVER, baseUrl + "webserver.png"));
            serverRepo.save(new Server(0, "192.168.1.21", "Filezilla", "16GB",
                    SERVER_UP, FILE_SERVER, baseUrl + "fileserver.png"));
            serverRepo.save(new Server(0, "109.133.45.89", "Mysql", "64GB",
                    SERVER_UP, DATABASE_SERVER, baseUrl + "dbserver.png"));
        };
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                WebMvcConfigurer.super.addCorsMappings(registry);
                registry.addMapping("/**")
                        .allowedMethods("*")
                        .allowedOrigins("http://localhost:4200", "http://localhost:3000")
                        .allowCredentials(true)
                        .allowedHeaders("*")
                        .allowedOriginPatterns("**/");
            }
        };
    }
}
