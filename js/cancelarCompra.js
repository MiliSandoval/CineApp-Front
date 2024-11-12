async function cancelarCompra(id) {
    try {
        if (window.confirm("¿Seguro que desea registrar la baja de la compra?")) {
            const response = await fetch(`https://localhost:7254/api/Cine/cancelar/compra?comprobante=${id}`, { method: 'DELETE' });

            if (response.ok) {
                alert("La compra fue cancelada exitosamente.");
            } else {
                const errorText = await response.text();
                console.error("Error al cancelar la compra:", response.status, errorText);
                alert(`No se pudo eliminar la compra. Estado: ${response.status}, Mensaje: ${errorText}`);
            }
        }
    } catch (error) {
        console.error("Error al registrar la baja de compra:", error);
        alert("Hubo un error de conexión: " + error.message);
    }
}
