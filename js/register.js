document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = {
            nombre: document.getElementById('firstName').value.trim(),
            apellido: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('phone').value.trim(),
            usuario: document.getElementById('username').value.trim(),
            contraseña: document.getElementById('password').value.trim()
        };


        if (Object.values(formData).some(value => !value)) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const response = await fetch('https://localhost:7254/api/Cine/crear/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Usuario creado exitosamente");
            localStorage.setItem('userData', JSON.stringify(data));
            window.location.href = 'main.html';
        } else {
            alert(data.message || 'Error al crear el usuario');
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al conectar con el servidor");
    }
});