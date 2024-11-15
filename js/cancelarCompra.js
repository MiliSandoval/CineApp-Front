document.getElementById("cancelForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 
    const comprobante = document.getElementById("comprobante").value;
    await cancelarCompra(comprobante);
});

async function cancelarCompra(id) {
    const resultContainer = document.getElementById("result");
    resultContainer.style.display = "none"; 
    resultContainer.innerHTML = ""; 

    try {
        if (window.confirm("¿Seguro que desea registrar la baja de la compra?")) {
            const response = await fetch(`https://localhost:7254/api/Cine/cancelar/compra?comprobante=${id}`, { method: 'DELETE' });

            if (response.ok) {
                mostrarMensaje(resultContainer, "La compra fue cancelada exitosamente.", "success");
            } else {
                const errorText = await response.text();
                console.error("Error al cancelar la compra:", response.status, errorText);
                mostrarMensaje(resultContainer, `No se pudo cancelar la compra. Por favor, intente más tarde. Estado: ${response.status}`, "error");
            }
        }
    } catch (error) {
        console.error("Error al registrar la baja de compra:", error);
        mostrarMensaje(resultContainer, `Hubo un error de conexión: ${error.message}. Por favor, intente más tarde.`, "error");
    }
}

function mostrarMensaje(container, mensaje, tipo) {
    container.style.display = "block";
    container.innerHTML = `<p class="${tipo}">${mensaje}</p>`;
}
