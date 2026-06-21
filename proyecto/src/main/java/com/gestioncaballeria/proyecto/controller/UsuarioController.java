package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Usuario;
import com.gestioncaballeria.proyecto.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        return usuarioService.registrar(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Optional<Usuario> usuarioLogueado =
                usuarioService.login(
                        usuario.getCorreo(),
                        usuario.getPassword()
                );

        if (usuarioLogueado.isPresent()) {
            return ResponseEntity.ok(usuarioLogueado.get());
        }

        return ResponseEntity.badRequest()
                .body("Correo o contraseña incorrectos");
    }

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.findAll();
    }

    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        return usuarioService.save(usuario);
    }
}
