/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if(navToggle){
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}
/*===== MENU HIDDEN =====*/
if(navClose){
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link') 

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))   

/*=============== ADD SHADOW HEADER ===============*/
const scrollHeader = () => {
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                       : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', scrollHeader)



/*=============== SWIPER POPULAR ===============*/
const swiperPopular = new Swiper('.popular__swiper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 32,
    slidesPerView: 'auto',
    centeredSlides: 'auto',
    breakpoints: {
        1150: {
            spaceBetween: 80,
        },
    },
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionClass.classList.add('active-link')
        } else {
            sectionClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 100,
})
sr.reveal(`.popular__swiper, .footer__container, .footer__copy`)
sr.reveal(`.home__shape`,{origin: 'bottom'})
sr.reveal(`.home__coffee`, {delay:1000, distance: '200px',duration: 1500})
sr.reveal(`.home__splash`, {delay:1000, scale:0,duration: 1500})
sr.reveal(`.home__bean-1, .home__bean-2`, {delay:2200,scale: 0,duration: 1500,rotate:{z:180}})
sr.reveal(`.home__ice-1, .home__ice-2`, {delay:2600,scale: 0,duration: 1500,rotate:{z:180}})
sr.reveal(`.home__leaf`, {delay:2800,scale: 0,duration: 1500,rotate:{z:90}})
sr.reveal(`.home__title`, {delay:3500})
sr.reveal(`.home__data .home__sticker`,  {delay:4000})
sr.reveal(`.about__images`, {origin:'left'})
sr.reveal(`.about__images`, {origin:'right'})
sr.reveal(`.about__coffee`, {delay: 1000})
sr.reveal(`.about__leaf-1, .about__leaf-2`, {delay: 1400 ,rotate:{z:90}})
sr.reveal(`.products__card, .contact__info`, {interval:100})
sr.reveal(`.contact__shape`, {delay:600, scale:0})
sr.reveal(`.contact__delivery`, {delay:1200})




///

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.products__button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productCard = btn.closest('.products__card');
            const name = productCard.querySelector('.products__name').textContent;
            const priceText = productCard.querySelector('.products__price').textContent;
            const price = parseFloat(priceText.replace('$', ''));

            const product = { name, price };

            // Lire panier existant
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Vérifie si le produit existe déjà
            const exists = cart.find(p => p.name === name);
            if (exists) {
                alert("Ce produit est déjà dans le panier.");
                return;
            }

            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${name} ajouté au panier !`);
        });
    });
});
















document.addEventListener('DOMContentLoaded', () => {
  const cart = [];

  // Ajout au panier
  document.querySelectorAll('.products__button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productCard = btn.closest('.products__card');
      const id = btn.getAttribute('data-id');
      const name = productCard.querySelector('.products__name').innerText;
      const priceText = productCard.querySelector('.products__price').innerText;
      const price = parseFloat(priceText.replace('$', ''));

      addToCart(id, name, price);
      console.log(cart);
    });


  });

    function addToCart(id, name, price) {
  const existing = cart.find(item => item._id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ _id: id, name, price, qty: 1 });
  }
  updateCartUI();
}



  function updateCartUI() {
    const cartBox = document.getElementById('cartBox');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartBox.classList.remove('hidden');
    cartItems.innerHTML = '';

    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;

      const li = document.createElement('li');
      li.innerHTML = `
        <span style="flex: 1;">${item.name}</span>
        <button onclick="changeQty(${idx}, -1)">
          <i class="ri-subtract-line"></i>
        </button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${idx}, 1)">
          <i class="ri-add-line"></i>
        </button>
        <span>= $${(item.price * item.qty).toFixed(2)}</span>
        <button onclick="removeItem(${idx})">
          <i class="ri-delete-bin-line"></i>
        </button>
      `;


      cartItems.appendChild(li);
    });

    cartTotal.innerText = `$${total.toFixed(2)}`;
  }

  window.changeQty = function(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }

  window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  }

  // ✅ Valider commande
  const checkoutBtn = document.getElementById('checkoutBtn');
    
  // admin commande
    const userRole = localStorage.getItem('userRole') || 'client';

    if (userRole === 'admin') {
      console.log("Bienvenue, admin");
      document.getElementById("admin-tools")?.classList.remove("hidden");
    } else {
      console.log("Bienvenue, client");
    }

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert("Impossible de récupérer votre email. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  cart, email })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Commande confirmée ! Un reçu vous a été envoyé par email.");
          cart.length = 0;
          updateCartUI();
        } else {
          alert(result.error || "Une erreur est survenue.");
        }
      } else {
        const text = await response.text(); // Pour lire le HTML s'il y en a
        console.error("Réponse non-OK :", text);
        alert("Erreur lors de la commande. Vérifie le backend.");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur.");
      console.error(err);
    }
  });
}


// DRAGGABLE CART BOX
const cartBox = document.getElementById("cartBox");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

cartBox.addEventListener("mousedown", (e) => {
  // Clique uniquement si on clique dans le header (ou tout le box)
  if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'I') {
    isDragging = true;
    offsetX = e.clientX - cartBox.offsetLeft;
    offsetY = e.clientY - cartBox.offsetTop;
    cartBox.style.cursor = "grabbing";
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    cartBox.style.left = e.clientX - offsetX + "px";
    cartBox.style.top = e.clientY - offsetY + "px";
    cartBox.style.bottom = "auto"; // on désactive le bottom fixed
    cartBox.style.right = "auto";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  cartBox.style.cursor = "grab";
});



  // ✅ Déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userEmail');
      window.location.href = '../2/index.html';
    });
  }
});
//admin commande
function ajouterProduit() {
  document.getElementById("form-ajout-produit").classList.toggle("hidden");
}

function envoyerProduit() {
  const nom = document.getElementById("nomProduit").value;
  const prix = parseFloat(document.getElementById("prixProduit").value);
  const image = document.getElementById("imageProduit").files[0];

  const formData = new FormData();
  formData.append("nom", nom);
  formData.append("prix", prix);
  formData.append("image", image);

  fetch("http://localhost:5000/api/products", {
    method: "POST",
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      alert("Produit ajouté !");
      location.reload();
    })
    .catch(err => console.error(err));
}

function voirCommandes() {
  fetch("http://localhost:5000/api/orders")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#table-commandes tbody");
      tbody.innerHTML = "";

      data.forEach(cmd => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${cmd.email}</td>
          <td>${cmd.items.map(p => p.nom).join(", ")}</td>
          <td>${cmd.items.map(p => p.quantite).join(", ")}</td>
          <td>${new Date(cmd.date).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });

      document.getElementById("liste-commandes").classList.remove("hidden");
    });
}




function afficherProduits() {
  fetch(`${API_URL}/api/products`)
    .then(res => res.json())
    .then(data => {
      const conteneur = document.getElementById('product-list'); 
      conteneur.innerHTML = data.map(p => `
        <article class="products__card">
          <div class="products__images">
            <img src="${API_URL}/${p.image}" alt="${p.nom}" class="products__coffee">
          </div>
          <div class="products__data">
            <h3 class="products__name">${p.nom}</h3>
            <span class="products__price">$${p.prix.toFixed(2)}</span>
            <button class="products__button" data-id="${p._id}">
              <i class="ri-shopping-bag-3-fill"></i>
            </button>
          </div>
        </article>
      `).join('');

      // Réattacher les events après le render
      attachPanierEvents();
    });
}

