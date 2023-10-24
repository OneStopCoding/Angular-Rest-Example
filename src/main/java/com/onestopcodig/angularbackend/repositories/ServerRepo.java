package com.onestopcodig.angularbackend.repositories;

import com.onestopcodig.angularbackend.models.Server;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServerRepo extends JpaRepository<Server, Long> {
    Server findServerByIpAddress(String IpAddress);
}
