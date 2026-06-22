package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Usuario;
import com.gestioncaballeria.proyecto.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void fixPasswords() {
        List<Usuario> users = usuarioRepository.findAll();
        for (Usuario u : users) {
            if (u.getPassword() != null && !u.getPassword().startsWith("$2a$")) {
                u.setPassword(passwordEncoder.encode(u.getPassword()));
                usuarioRepository.save(u);
            }
        }
    }

    @PostConstruct
    public void initDefaultUsers() {
        if (usuarioRepository.count() == 0) {
            Usuario cliente = new Usuario();
            cliente.setNombre("Cliente Prueba");
            cliente.setCorreo("cliente@caballeriza.com");
            cliente.setPassword(passwordEncoder.encode("cliente123"));
            cliente.setRol("CLIENTE");
            usuarioRepository.save(cliente);

            Usuario vet = new Usuario();
            vet.setNombre("Dr. Veterinario");
            vet.setCorreo("veterinario@caballeriza.com");
            vet.setPassword(passwordEncoder.encode("vet123"));
            vet.setRol("VETERINARIO");
            usuarioRepository.save(vet);

            Usuario admin = new Usuario();
            admin.setNombre("Admin Principal");
            admin.setCorreo("admin@caballeriza.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol("ADMINISTRADOR");
            usuarioRepository.save(admin);
        }

        if (usuarioRepository.findByCorreo("cuidador@caballeriza.com").isEmpty()) {
            Usuario cuidador = new Usuario();
            cuidador.setNombre("Cuidador Principal");
            cuidador.setCorreo("cuidador@caballeriza.com");
            cuidador.setPassword(passwordEncoder.encode("cuidador123"));
            cuidador.setRol("CUIDADOR");
            usuarioRepository.save(cuidador);
        }

        if (usuarioRepository.findByCorreo("admin@caballeria.com").isEmpty()) {
            Usuario admin2 = new Usuario();
            admin2.setNombre("Admin Secundario");
            admin2.setCorreo("admin@caballeria.com");
            admin2.setPassword(passwordEncoder.encode("admin123"));
            admin2.setRol("ADMINISTRADOR");
            usuarioRepository.save(admin2);
        }
    }

    public Usuario registrar(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> login(String correo, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreo(correo);

        if (usuario.isPresent() &&
                passwordEncoder.matches(password, usuario.get().getPassword())) {
            return usuario;
        }
        return Optional.empty();
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }
}
