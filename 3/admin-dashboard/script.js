const API_URL = "http://localhost:5000";
const adminEmail = 'yoanlable@gmail.com';

function logout() {
  localStorage.clear();
  window.location.href = '../../2/index.html';
}

function afficherSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('d-none'));
  document.getElementById(id).classList.remove('d-none');

  if (id === 'produits') afficherProduits();
  if (id === 'commandes') afficherCommandes();
  if (id === 'utilisateurs') afficherUtilisateurs();
  if (id === 'stats') afficherStatistiques();
  if (id === 'stock') afficherStock();
  if (id === 'historique') afficherHistoriqueConnexions();



}

function afficherProduits() {
  fetch(`${API_URL}/api/products`)
    .then(res => res.json())
    .then(data => {
      console.log("Données reçues :", data);
      const div = document.getElementById('liste-produits');
      if (!data.length) {
        div.innerHTML = "<p>Aucun produit disponible.</p>";
        return;
      }

      div.innerHTML = `
        <div class="grille-produits">
          ${data.map(p => `
            <div class="carte-produit">
              <img src="${API_URL}/${p.image}" alt="${p.nom}">
              <h4 class="products__name">${p.nom}</h4>
              <p class="products__price">$${p.prix.toFixed(2)}</p>
              
            </div>
          `).join('')}
        </div>
      `;
    })
    .catch(err => {
      console.error("Erreur de chargement des produits :", err);
    });

    attacherFiltreRechercheProduits();

}

let commandesGlobales = []; // On garde ça pour filtrage + export

function afficherCommandes() {
  fetch(`${API_URL}/api/orders`)
    .then(res => res.json())
    .then(data => {
      commandesGlobales = data;
      afficherCommandesFiltrées(); // appel du filtre après chargement
    })
    .catch(err => {
      console.error(" Erreur chargement commandes :", err);
    });
}

// Affiche les commandes en fonction du filtre actif
function afficherCommandesFiltrées() {
  const emailFiltre = document.getElementById('filtre-email')?.value.toLowerCase() || "";
  const dateFiltre = document.getElementById('filtre-date')?.value || "all";

  const maintenant = new Date();
  const debutSemaine = new Date();
  debutSemaine.setDate(maintenant.getDate() - 7);

  const commandesFiltrées = commandesGlobales.filter(commande => {
    const emailOK = (commande.clientEmail || "").toLowerCase().includes(emailFiltre);
    const dateCommande = new Date(commande.date);
    let dateOK = true;

    if (dateFiltre === "today") {
      dateOK = dateCommande.toDateString() === maintenant.toDateString();
    } else if (dateFiltre === "week") {
      dateOK = dateCommande >= debutSemaine && dateCommande <= maintenant;
    }

    return emailOK && dateOK;
  });

  const div = document.getElementById("liste-commandes");
  if (!commandesFiltrées.length) {
    div.innerHTML = "<p class='text-white'>Aucune commande trouvée.</p>";
    return;
  }

  div.innerHTML = commandesFiltrées.map(commande => {
    const date = new Date(commande.date).toLocaleString("fr-FR");
    const client = commande.clientEmail || "Inconnu";

    const produitsHTML = commande.produits.map(p => {
      const produit = p.produitId;
      const nom = produit?.nom ?? "Produit inconnu";
      const prix = produit?.prix ?? 0;
      return `<li>${nom} - ${p.quantite} x ${prix.toFixed(2)} $</li>`;
    }).join("");

    return `
      <div class="bg-dark text-white p-4 rounded" style="box-shadow: 0 0 10px rgba(0,0,0,0.2);">
        <h5>Commande de <strong>${client}</strong> - ${date}</h5>
        <hr>
        <ul>${produitsHTML}</ul>
        <p class="fw-bold fs-5 mt-3">Total : ${commande.total.toFixed(2)} $</p>
      </div>
    `;
  }).join('');
}

// Événements à attacher une fois le DOM chargé
window.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('filtre-email');
  const dateSelect = document.getElementById('filtre-date');

  if (emailInput) emailInput.addEventListener('input', afficherCommandesFiltrées);
  if (dateSelect) dateSelect.addEventListener('change', afficherCommandesFiltrées);

  // Ajoute une ligne d'historique à chaque ouverture du dashboard
function enregistrerConnexionAdmin() {
  const maintenant = new Date();
  const entree = `Connexion à ${maintenant.toLocaleTimeString('fr-FR')} – ${maintenant.toLocaleDateString('fr-FR')}`;

  let historique = JSON.parse(localStorage.getItem('historiqueAdmin') || '[]');
  historique.unshift(entree); // Ajouter au début
  historique = historique.slice(0, 10); // Garder les 10 plus récentes
  localStorage.setItem('historiqueAdmin', JSON.stringify(historique));
}

enregistrerConnexionAdmin(); // Appel automatique à chaque chargement

});





//  GESTION UTILISATEURS
function afficherUtilisateurs() {
  fetch(`${API_URL}/api/auth/users`)
    .then(res => res.json())
    .then(users => {
      const tableBody = document.querySelector('#userTable tbody');
      tableBody.innerHTML = '';

      users.forEach(user => {
        const isAdmin = user.email === adminEmail;
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${user.email}</td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
          <td>${isAdmin ? 'Admin' : `<button onclick="deleteUser('${user._id}')">🗑 Supprimer</button>`}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error(" Erreur chargement utilisateurs :", err);
    });
}

function deleteUser(userId) {
  if (confirm("Supprimer cet utilisateur ?")) {
    fetch(`${API_URL}/api/auth/users/${userId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          alert("Utilisateur supprimé");
          afficherUtilisateurs();
        } else {
          alert("Erreur lors de la suppression");
        }
      })
      .catch(err => {
        console.error(" Erreur suppression utilisateur :", err);
      });
  }
}

// Ajout produit
document.getElementById("form-ajout-produit").addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById('nomProduit').value;
  const prix = document.getElementById('prixProduit').value;
  const image = document.getElementById('imageProduit').files[0];

  const formData = new FormData();
  formData.append('nom', nom);
  formData.append('prix', prix);
  formData.append('image', image);

  fetch(`${API_URL}/products`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      alert('Produit ajouté avec succès !');
      afficherProduits();
      afficherSection('produits');
    })
    .catch(err => {
      console.error(err);
      alert('Erreur lors de l’ajout');
    });
});


function afficherStatistiques() {
  fetch(`${API_URL}/api/orders`)
    .then(res => res.json())
    .then(orders => {
      const nbCommandes = orders.length;
      const totalRevenu = orders.reduce((sum, cmd) => sum + cmd.total, 0);
      const panierMoyen = nbCommandes ? (totalRevenu / nbCommandes).toFixed(2) : 0;

      const produitsParNom = {};
      orders.forEach(cmd => {
        cmd.produits.forEach(p => {
          const nom = p.produitId?.nom || "Inconnu";
          produitsParNom[nom] = (produitsParNom[nom] || 0) + p.quantite;
        });
      });
      const top3 = Object.entries(produitsParNom)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 produits


      const stats = [
        {
          titre: "Nombre de commandes",
          valeur: nbCommandes,
          icone: '<i class="bx bx-package"></i>'
        },
        {
          titre: "Revenu total",
          valeur: `${totalRevenu.toFixed(2)} $`,
          icone: '<i class="bx bx-money"></i>'
        },
        {
          titre: "Panier moyen",
          valeur: `${panierMoyen} $`,
          icone: '<i class="bx bx-cart"></i>'
        }
      ];


      const bloc = document.getElementById("bloc-stats");
      bloc.innerHTML = `
        ${stats.map(s => `
          <div class="col-md-4">
            <div class="card-stat">
              <div class="icon">${s.icone}</div>
              <div class="stat-content">
                <h5>${s.titre}</h5>
                <p>${s.valeur}</p>
              </div>
            </div>
          </div>
        `).join('')}
        <div class="col-12">
        <div class="card-stat">
          <div class="icon"><i class="bx bx-bar-chart-alt-2"></i></div>
          <div class="stat-content">
            <h5>Produits vendus</h5>
            <ul style="margin-top:10px">
              ${Object.entries(produitsParNom).map(([nom, qty]) => `<li>${nom} : ${qty}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="col-12">
          <div class="card-stat">
            <div class="icon"><i class="bx bx-star"></i></div>
            <div class="stat-content">
              <h5> Top 3 Produits</h5>
              <ol style="margin-top: 10px;">
                ${top3.map(([nom, qty], i) => `<li><strong>${i + 1}.</strong> ${nom} - ${qty} ventes</li>`).join("")}
              </ol>
            </div>
          </div>
       </div>


      </div>

      `;
    })
    .catch(err => {
      console.error("Erreur statistiques :", err);
    });
}

// Exemple : commandes par jour (mock)
const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const donnees = [5, 8, 4, 10, 6, 12, 7];

// Couleurs depuis le :root
const firstColor = getComputedStyle(document.documentElement).getPropertyValue('--first-color').trim();
const darkColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-color').trim();
const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color').trim();

const ctx = document.getElementById('chartCommandes').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Commandes',
      data: donnees,
      fill: true,
      borderColor: firstColor,
      backgroundColor: `${firstColor}20`, // Transparence
      tension: 0.4,
      pointBackgroundColor: darkColor,
      pointBorderColor: whiteColor,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: whiteColor,
          font: { family: 'Montserrat' }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: whiteColor,
          font: { family: 'Montserrat' }
        }
      },
      y: {
        ticks: {
          color: whiteColor,
          font: { family: 'Montserrat' }
        },
        beginAtZero: true
      }
    }
  }
});

function afficherStock() {
  fetch(`${API_URL}/api/products`)
    .then(res => res.json())
    .then(produits => {
      const div = document.getElementById("liste-stock");
      if (!produits.length) {
        div.innerHTML = "<p class='text-white'>Aucun produit en stock.</p>";
        return;
      }

      div.innerHTML = produits.map(p => {
        const statutClasse = p.stock === 0 ? "stock-out" :
                             p.stock < 10 ? "stock-low" : "stock-ok";

        return `
          <div class="stock-card">
            <span class="${statutClasse}">
              ${p.stock === 0 ? "Rupture" : p.stock < 10 ? "Limité" : "Stock OK"}
            </span>
            <h3 class="stock-title">${p.nom}</h3>
            <p class="stock-info">Prix : <strong>${p.prix.toFixed(2)} $</strong></p>
            <p class="stock-info">Stock : <strong>${p.stock}</strong></p>
          </div>
        `;
      }).join('');
    })
    .catch(err => {
      console.error(" Erreur chargement stock :", err);
    });
}

function exporterCSV() {
  const emailFiltre = document.getElementById('filtre-email').value.toLowerCase();
  const dateFiltre = document.getElementById('filtre-date').value;

  const maintenant = new Date();
  const debutSemaine = new Date();
  debutSemaine.setDate(maintenant.getDate() - 7);

  const commandes = commandesGlobales.filter(commande => {
    const emailMatch = (commande.clientEmail || "").toLowerCase().includes(emailFiltre);
    const dateCommande = new Date(commande.date);
    let dateMatch = true;

    if (dateFiltre === "today") {
      dateMatch = dateCommande.toDateString() === maintenant.toDateString();
    } else if (dateFiltre === "week") {
      dateMatch = dateCommande >= debutSemaine && dateCommande <= maintenant;
    }

    return emailMatch && dateMatch;
  });

  let csv = "Email,Date,Produit,Quantité,Prix unitaire\n";

  commandes.forEach(cmd => {
    const email = cmd.clientEmail || "Inconnu";
    const date = new Date(cmd.date).toLocaleString("fr-FR");
    cmd.produits.forEach(p => {
      const nom = p.produitId?.nom ?? "Produit inconnu";
      const prix = p.produitId?.prix ?? 0;
      csv += `"${email}","${date}","${nom}",${p.quantite},${prix.toFixed(2)}\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'commandes.csv';
  a.click();
}
function attacherFiltreRechercheProduits() {
  const searchInput = document.getElementById('searchProductInput');
  const produitsContainer = document.getElementById('liste-produits');

  if (!searchInput || !produitsContainer) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    const cards = produitsContainer.querySelectorAll('.carte-produit');
    cards.forEach(card => {
      const name = card.querySelector('.products__name')?.textContent.toLowerCase() || '';
      card.style.display = name.includes(query) ? 'block' : 'none';
    });
  });
}

function afficherHistoriqueConnexions() {
  const historique = JSON.parse(localStorage.getItem('historiqueAdmin') || '[]');
  const ul = document.getElementById('liste-historique');
  ul.innerHTML = '';

  if (!historique.length) {
    ul.innerHTML = '<li class="list-group-item">Aucune connexion enregistrée.</li>';
    return;
  }

  historique.forEach(entree => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = entree;
    ul.appendChild(li);
  });
}

