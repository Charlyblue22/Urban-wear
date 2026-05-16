let carrito = [];
let total = 0;

// ============================
// ELEMENTOS DEL DOM
// ============================
const botones = document.querySelectorAll(".btn-comprar");
const carritoBtn = document.getElementById("abrir-carrito");
const carritoPanel = document.getElementById("carrito-panel");
const carritoOverlay = document.getElementById("carrito-overlay");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalTexto = document.getElementById("total");
const countBadge = document.getElementById("carrito-count-badge");
const btnVaciar = document.getElementById("btn-vaciar");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");

// ============================
// ABRIR / CERRAR CARRITO
// ============================
function abrirCarrito() {
  carritoPanel.classList.add("activo");
  carritoOverlay.classList.add("activo");
  document.body.style.overflow = "hidden";
}

function cerrarCarritoFn() {
  carritoPanel.classList.remove("activo");
  carritoOverlay.classList.remove("activo");
  document.body.style.overflow = "";
}

carritoBtn.addEventListener("click", abrirCarrito);
cerrarCarrito.addEventListener("click", cerrarCarritoFn);
carritoOverlay.addEventListener("click", cerrarCarritoFn);

// Cerrar con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarCarritoFn();
});

// ============================
// TOAST
// ============================
let toastTimer;
function mostrarToast(nombre) {
  toastMsg.textContent = `${nombre} añadido`;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

// ============================
// AGREGAR PRODUCTOS
// ============================
botones.forEach(boton => {
  boton.addEventListener("click", () => {
    const card = boton.closest(".rutina-card, .tip-item");

    const nombre = card.querySelector("h3, h4").textContent.trim();

    const precioElemento = card.querySelector(".precio, .precio-small");
    const precioTexto = precioElemento.childNodes[0].textContent;
    const precio = parseInt(precioTexto.replace(/\D/g, ""));

    const producto = { nombre, precio };
    carrito.push(producto);

    actualizarCarrito();
    mostrarToast(nombre);

    // Animación del botón
    boton.textContent = "✔ Añadido";
    boton.style.background = "var(--tierra-oscura)";
    boton.style.color = "#fff";
    setTimeout(() => {
      boton.textContent = "Añadir al carrito";
      boton.style.background = "";
      boton.style.color = "";
    }, 1600);
  });
});

// ============================
// VACIAR CARRITO
// ============================
btnVaciar.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});

// ============================
// ACTUALIZAR CARRITO
// ============================
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <li style="text-align:center;color:var(--texto-suave);padding:2rem 0;font-size:.9rem;background:transparent;">
        Tu carrito está vacío
      </li>`;
  }

  carrito.forEach((producto, index) => {
    total += producto.precio;

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${producto.nombre}</strong>
        $${producto.precio.toLocaleString("es-CL")}
      </div>
      <button class="btn-eliminar" onclick="eliminarProducto(${index})" title="Eliminar">✕</button>
    `;
    listaCarrito.appendChild(li);
  });

  countBadge.textContent = carrito.length;
  totalTexto.textContent = total.toLocaleString("es-CL");
}

// ============================
// ELIMINAR PRODUCTO
// ============================
function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// ============================
// FILTROS DE CATEGORÍA
// ============================
const filtros = document.querySelectorAll(".filtro-btn");
const cards = document.querySelectorAll(".rutina-card");

filtros.forEach(btn => {
  btn.addEventListener("click", () => {
    filtros.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filtro = btn.dataset.filtro;

    cards.forEach(card => {
      if (filtro === "todos" || card.dataset.categoria === filtro) {
        card.classList.remove("oculto");
      } else {
        card.classList.add("oculto");
      }
    });
  });
});

// ============================
// BUSCADOR EN TIEMPO REAL
// ============================
const buscador = document.getElementById("buscador");
buscador.addEventListener("input", () => {
  const query = buscador.value.toLowerCase().trim();

  cards.forEach(card => {
    const nombre = card.querySelector("h3, h4").textContent.toLowerCase();
    if (nombre.includes(query)) {
      card.classList.remove("oculto");
    } else {
      card.classList.add("oculto");
    }
  });

  // Si busca algo, desactiva filtros visuales
  if (query) {
    filtros.forEach(b => b.classList.remove("active"));
  }
});

// ============================
// ANIMACIONES AL SCROLL
// ============================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
// ============================
// IR A PAGAR
// ============================
const btnCheckout = document.querySelector(".btn-checkout");

btnCheckout.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  // Construir resumen de compra
  let resumen = "🛍️ ¡Gracias por tu compra!\n\n";
  resumen += "📦 Productos comprados:\n";

  carrito.forEach(producto => {
    resumen += `• ${producto.nombre} — $${producto.precio.toLocaleString("es-CL")}\n`;
  });

  resumen += `\n💰 Total pagado: $${total.toLocaleString("es-CL")}`;
  resumen += "\n\n✅ Tu pedido fue procesado con éxito. ¡Te llegará pronto!";

  alert(resumen);

  // Vaciar carrito después de pagar
  carrito = [];
  actualizarCarrito();
  cerrarCarritoFn();
});