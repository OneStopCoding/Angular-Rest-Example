package com.onestopcodig.angularbackend.services;

import com.onestopcodig.angularbackend.models.Server;

import java.io.IOException;
import java.util.List;
public interface ServerService {
    Server create(Server server);
    Server ping(String ipAddress) throws IOException, InterruptedException;
    List<Server> list(int limit);
    Server get(Long id);
    Server update(Server server);
    Boolean delete(Long id);
    Server findByIp(String ip);
}
