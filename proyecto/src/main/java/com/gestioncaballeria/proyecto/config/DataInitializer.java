package com.gestioncaballeria.proyecto.config;

import com.gestioncaballeria.proyecto.model.Usuario;
import com.gestioncaballeria.proyecto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verificamos si la tabla de usuarios está vacía
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setCorreo("admin@caballeria.com");
            
            // Encriptamos la contraseña por defecto
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            // Le asignamos el rol
            admin.setRol("ADMINISTRADOR");

            // Lo guardamos en la base de datos
            usuarioRepository.save(admin);
            
            System.out.println("==================================================");
            System.out.println("✅ USUARIO ADMINISTRADOR POR DEFECTO CREADO");
            System.out.println("Correo: admin@caballeria.com");
            System.out.println("Clave:  admin123");
            System.out.println("==================================================");
        }
    }
}
