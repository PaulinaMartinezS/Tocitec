document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Funcionalidad del Carrusel de Imágenes ---
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;
    let slideInterval;


    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            startSlideShow();
        });
        carouselDotsContainer.appendChild(dot);
    });

    const carouselDots = document.querySelectorAll('.carousel-dots .dot');

    function goToSlide(index) {
        carouselSlides[currentSlide].classList.remove('active');
        carouselDots[currentSlide].classList.remove('active');

        currentSlide = (index + carouselSlides.length) % carouselSlides.length;

        carouselSlides[currentSlide].classList.add('active');
        carouselDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000);
    }


    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        startSlideShow();
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        startSlideShow();
    });


    goToSlide(0);
    startSlideShow();


    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');


    function handleNavLinkClick(event) {
        event.preventDefault();


        navLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));

        event.target.classList.add('active');

        const targetId = event.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - document.querySelector('.header').offsetHeight,
                behavior: 'smooth'
            });
        }

        if (mobileNavOverlay.classList.contains('active')) {
            mobileNavOverlay.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    window.addEventListener('scroll', () => {
        const headerHeight = document.querySelector('.header').offsetHeight;
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });


    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const closeMobileNav = document.querySelector('.close-mobile-nav');

    hamburgerMenu.addEventListener('click', () => {
        mobileNavOverlay.classList.add('active');
    });

    closeMobileNav.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('active');
    });

    // Cierra el menú móvil si se hace clic fuera de él
    mobileNavOverlay.addEventListener('click', (event) => {
        if (event.target === mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
        }
    });


    //4. Funcionalidad del Carrito de Compras 
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const shoppingCartOverlay = document.querySelector('.shopping-cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const cartFinalTotalSpan = document.getElementById('cart-final-total');
    const deliveryOptionSelect = document.getElementById('delivery-option');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const addToCartMessage = document.getElementById('add-to-cart-message');
    const checkoutBtn = document.querySelector('.btn-checkout');
    const checkoutConfirmationMessage = document.getElementById('checkout-confirmation-message');
    let cart = JSON.parse(localStorage.getItem('tociTechCart')) || [];

    // Función para guardar el carrito en localStorage
    function saveCart() {
        localStorage.setItem('tociTechCart', JSON.stringify(cart));
    }

    function showTemporaryMessage(messageElement) {
        messageElement.classList.add('visible');
        setTimeout(() => {
            messageElement.classList.remove('visible');
        }, 3000);
    }


    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="item-quantity">
                        <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                subtotal += item.price * item.quantity;
            });
        }

        cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        updateFinalTotal(subtotal);
        cartCountSpan.textContent = cart.reduce((total, item) => total + item.quantity, 0); // Actualiza el contador del carrito
        saveCart(); // Guarda el carrito cada vez que se actualiza la UI
    }


    function updateFinalTotal(currentSubtotal) {
        const selectedOption = deliveryOptionSelect.options[deliveryOptionSelect.selectedIndex];
        const deliveryCost = parseFloat(selectedOption.dataset.cost);
        const finalTotal = currentSubtotal + deliveryCost;
        cartFinalTotalSpan.textContent = `$${finalTotal.toFixed(2)}`;
    }

    // Eliminar producto del carrito o actualizar cantidad
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn') || event.target.closest('.remove-item-btn')) {
            const button = event.target.closest('.remove-item-btn');
            const productId = button.dataset.id;
            cart = cart.filter(item => item.id !== productId); // Filtra para eliminar el item
            updateCartUI();
        }
    });

    cartItemsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('item-quantity')) {
            const input = event.target;
            const productId = input.dataset.id;
            let newQuantity = parseInt(input.value);

            // Asegurarse de que la cantidad no sea menor que 1
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
                input.value = 1; // Restablece el valor del input a 1
            }

            const itemToUpdate = cart.find(item => item.id === productId);
            if (itemToUpdate) {
                itemToUpdate.quantity = newQuantity;
                updateCartUI();
            }
        }
    });

    // Actualizar total final al cambiar la opción de entrega
    deliveryOptionSelect.addEventListener('change', () => {
        const currentSubtotal = parseFloat(cartSubtotalSpan.textContent.replace('$', ''));
        updateFinalTotal(currentSubtotal);
    });

    // Event listener para el botón "Proceder al Pago"
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            // Si el carrito está vacío, puedes mostrar un mensaje diferente o simplemente no hacer nada
            alert('Tu carrito está vacío. Por favor, añade productos antes de proceder al pago.');
            return;
        }

        // Simular el proceso de pago:
        // 1. Ocultar el carrito
        shoppingCartOverlay.classList.remove('active');
        // 2. Mostrar mensaje de confirmación de pago
        showTemporaryMessage(checkoutConfirmationMessage);
        // 3. Vaciar el carrito
        cart = [];
        updateCartUI(); // Actualizar la UI del carrito para reflejar que está vacío
    });


    // Mostrar/Ocultar carrito
    cartIconContainer.addEventListener('click', () => {
        shoppingCartOverlay.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        shoppingCartOverlay.classList.remove('active');
    });

    // Cierra el carrito si se hace clic fuera de él
    shoppingCartOverlay.addEventListener('click', (event) => {
        if (event.target === shoppingCartOverlay) {
            shoppingCartOverlay.classList.remove('active');
        }
    });

    // Inicializa el carrito al cargar la página
    updateCartUI();

    // --- 5. Funcionalidad del Formulario de Contacto ---
    const contactForm = document.querySelector('.contact-form');
    // Añade un div para mensajes de validación
    const formMessageDiv = document.createElement('div');
    formMessageDiv.classList.add('form-message');
    contactForm.insertBefore(formMessageDiv, contactForm.firstChild); // Inserta al principio del formulario

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        // No es necesario obtener el valor de 'subject' para la validación si no tiene reglas específicas

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        let isValid = true;
        let errorMessage = '';

        // Limpia mensajes de error previos
        formMessageDiv.textContent = '';
        formMessageDiv.classList.remove('success', 'error');
        nameInput.classList.remove('error-input');
        emailInput.classList.remove('error-input');
        messageInput.classList.remove('error-input');


        // Validación del nombre
        if (name === '') {
            isValid = false;
            errorMessage += 'El nombre es requerido.<br>';
            nameInput.classList.add('error-input');
        }

        // Validación del email
        if (email === '') {
            isValid = false;
            errorMessage += 'El email es requerido.<br>';
            emailInput.classList.add('error-input');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Regex simple para validar email
            isValid = false;
            errorMessage += 'El formato del email no es válido.<br>';
            emailInput.classList.add('error-input');
        }

        if (message === '') {
            isValid = false;
            errorMessage += 'El mensaje es requerido.<br>';
            messageInput.classList.add('error-input');
        } else if (message.length < 10) {
            isValid = false;
            errorMessage += 'El mensaje debe tener al menos 10 caracteres.<br>';
            messageInput.classList.add('error-input');
        }

        if (isValid) {

            console.log('Formulario de contacto enviado:');
            console.log('Nombre:', name);
            console.log('Email:', email);
            console.log('Mensaje:', message);

            formMessageDiv.classList.add('success');
            formMessageDiv.innerHTML = '¡Gracias por tu mensaje, ' + name + '! Nos pondremos en contacto contigo pronto.';


            contactForm.reset();
        } else {
            formMessageDiv.classList.add('error');
            formMessageDiv.innerHTML = errorMessage;
        }
    });

    // --- 6. Animación para la Línea de Tiempo (Timeline) ---
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // --- 7. Funcionalidad de Filtrado de Productos (CORREGIDA Y OPTIMIZADA) ---
    const categoryLinks = document.querySelectorAll('.category-link');
    const productCards = document.querySelectorAll('.product-card');
    const filterButtonsContainer = document.querySelector('.product-filters');

    function updateProductFilter(category) {
        // Actualizar el estado activo de los botones de filtro
        const allFilterButtons = document.querySelectorAll('.btn-filter');
        allFilterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.category === category);
        });

        // Filtrar las tarjetas de producto
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldBeVisible = (category === 'all' || cardCategory === category);
            card.classList.toggle('hide', !shouldBeVisible);
        });
    }

    // Función para manejar los clics en los botones de filtro
    function handleFilterButtonClick(event) {
        const category = event.currentTarget.dataset.category;
        updateProductFilter(category);
    }

    // Añadir listeners a los botones de filtro que ya existen
    document.querySelectorAll('.btn-filter').forEach(button => {
        button.addEventListener('click', handleFilterButtonClick);
    });

    // Añadir listeners a los enlaces de las categorías destacadas
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const category = event.currentTarget.dataset.category;

            // Crear el botón de filtro para la categoría si no existe
            if (!document.querySelector(`.btn-filter[data-category="${category}"]`)) {
                const newButton = document.createElement('button');
                newButton.classList.add('btn', 'btn-filter');
                newButton.dataset.category = category;
                newButton.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                filterButtonsContainer.appendChild(newButton);
                // Añadir el listener al nuevo botón
                newButton.addEventListener('click', handleFilterButtonClick);
            }

            // Aplicar el filtro
            updateProductFilter(category);
        });
    });

    // Carga de los productos al cargar la página
    const productsGrid = document.getElementById("product-list");

    fetch("http://localhost:8080/api/products")
        .then(res => res.json())
        .then(data => {
            data.forEach(producto => {
                const card = document.createElement("div");
                card.classList.add("product-card");
                card.setAttribute("data-id", producto._id || "");
                card.setAttribute("data-name", producto.productName || "");
                card.setAttribute("data-price", producto.productPrice || "");
                card.setAttribute("data-category", producto.productCategory || "");

                card.innerHTML = `
        <img src="${producto.productImage}" alt="${producto.productName}">
        <div class="product-info">
          <h3>${producto.productName}</h3>
          <p class="product-description">${producto.productDescription}</p>
          <p class="product-price">$${parseFloat(producto.productPrice).toFixed(2)}</p>
          <button class="btn btn-add-to-cart">Añadir al Carrito</button>
        </div>
      `;

                productsGrid.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error al cargar productos:", err);
            productsGrid.innerHTML = "<p>No se pudieron cargar los productos en este momento.</p>";
        });

    productsGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-add-to-cart')) {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.dataset.name;
            const productPrice = parseFloat(productCard.dataset.price);
            const productImage = productCard.querySelector('img').src;

            const existingItem = cart.find(item => item.id === productId);

            console.log("Producto añadido al carrito:", {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            updateCartUI();
            showTemporaryMessage(addToCartMessage);
        }
    });
});
