package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.config.JwtUtil;
import com.gestioncaballeria.proyecto.model.Usuario;
import com.gestioncaballeria.proyecto.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        return usuarioService.registrar(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Optional<Usuario> usuarioLogueado = usuarioService.login(usuario.getCorreo(), usuario.getPassword());

        if (usuarioLogueado.isPresent()) {
            Usuario user = usuarioLogueado.get();
            String token = jwtUtil.generarToken(user.getCorreo(), user.getRol());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("usuario", user);
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Correo o contraseña incorrectos");
    }
}