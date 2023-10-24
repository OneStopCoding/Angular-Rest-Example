package com.onestopcodig.angularbackend.services.implementations;

import com.onestopcodig.angularbackend.enumerations.Type;
import com.onestopcodig.angularbackend.models.Server;
import com.onestopcodig.angularbackend.repositories.ServerRepo;
import com.onestopcodig.angularbackend.services.ServerService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.InetAddress;
import java.util.List;
import java.util.Random;

import static com.onestopcodig.angularbackend.enumerations.Status.SERVER_DOWN;
import static com.onestopcodig.angularbackend.enumerations.Status.SERVER_UP;
import static com.onestopcodig.angularbackend.enumerations.Type.FILE_SERVER;
import static com.onestopcodig.angularbackend.enumerations.Type.MAIL_SERVER;

@AllArgsConstructor
@Slf4j
@Service
@Transactional
public class ServerServiceImpl implements ServerService {
    private final ServerRepo serverRepo;
    @Override
    public Server create(Server server) {
        log.info("saving new server: {}", server.getName());
        server.setImageUrl(serverSetImageUrl(server.getType()));
        return serverRepo.save(server);
    }

    @Override
    public Server ping(String ipAddress) throws IOException, InterruptedException {
        log.info("Pinging server with ip-address: {}", ipAddress);
        Thread.sleep(10000);
        Server server = serverRepo.findServerByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(3000)? SERVER_UP: SERVER_DOWN);
        return serverRepo.save(server);
    }

    @Override
    public List<Server> list(int limit) {
        log.info("listing all servers");
        return serverRepo.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Fetching server with id: {}", id);
        return serverRepo.findById(id).orElse(null);
    }

    @Override
    public Server update(Server server) {
        log.info("updating server: {}", server.getName());
        return serverRepo.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("deleting server with id: {}", id);
        serverRepo.deleteById(id);
        return true;
    }

    @Override
    public Server findByIp(String ip) {
        return serverRepo.findServerByIpAddress(ip);
    }

    private String serverSetImageUrl(Type type) {
        String [] imageNames = {"mailserver.png", "dbserver.png", "fileserver.png", "webserver.png" };
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/servers/images/" +
                (type == Type.WEB_SERVER ? imageNames[3] : type == MAIL_SERVER ?
                        imageNames[0] : type == Type.DATABASE_SERVER ?
                        imageNames[1] : type == FILE_SERVER ? imageNames[2] :
                        imageNames[new Random().nextInt(4)])).toUriString();
    }


}
