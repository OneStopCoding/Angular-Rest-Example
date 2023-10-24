package com.onestopcodig.angularbackend.models;

import com.onestopcodig.angularbackend.enumerations.Status;
import com.onestopcodig.angularbackend.enumerations.Type;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Server {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(unique = true)
    @NotEmpty(message = "the column ip-address can't be empty or null")
    private String ipAddress;
    private String name;
    private String memory;
    private Status status;
    private Type type;
    private String imageUrl;
}
