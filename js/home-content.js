window.HOME_CONTENT = {
  instagramProfile: "https://www.instagram.com/viajandoconcabeza/",

  latestTrips: [
    {
      title: "ROMA",
      country: "Italia",
      days: "3 días",
      people: "2 personas",
      price: "€1.247",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=700&q=86",
      url: "destinos/italia/roma/index.html"
    },
    {
      title: "BALI",
      country: "Indonesia",
      days: "12 días",
      people: "2 personas",
      price: "€2.950",
      image: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=700&q=86",
      url: "destinos/indonesia/index.html"
    },
    {
      title: "SUECIA",
      country: "Suecia",
      days: "14 días",
      people: "2 personas",
      price: "€2.120",
      image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=700&q=86",
      url: "destinos/index.html"
    },
    {
      title: "PARÍS",
      country: "Francia",
      days: "4 días",
      people: "2 personas",
      price: "€980",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=86",
      url: "destinos/francia/index.html"
    }
  ],

  featuredGuide: {
    badge: "GUÍA DESTACADA",
    country: "ITALIA",
    title: "ROMA EN 3 DÍAS",
    rating: "★★★★★",
    ratingText: "5.0 (128 valoraciones)",
    description: "Nuestra guía completa para descubrir Roma con el mejor itinerario, mapa y presupuesto.",
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1000&q=88",
    url: "destinos/italia/roma/index.html",
    meta: ["◷ 3 días", "⌖ Mapa interactivo", "♙ Itinerario día a día", "€ Presupuesto real"],
    budgetSubtitle: "(2 personas / 3 días)",
    budget: [
      ["Vuelos", "€210"],
      ["Alojamiento", "€420"],
      ["Comida", "€260"],
      ["Entradas", "€180"],
      ["Transporte", "€67"],
      ["Otros", "€110"]
    ],
    total: "€1.247"
  },

  instagram: [
    {
      image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=82",
      url: "https://www.instagram.com/viajandoconcabeza/"
    },
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=82",
      url: "https://www.instagram.com/viajandoconcabeza/"
    },
    {
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=82",
      url: "https://www.instagram.com/viajandoconcabeza/"
    },
    {
      image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=82",
      url: "https://www.instagram.com/viajandoconcabeza/"
    },
    {
      image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=500&q=82",
      url: "https://www.instagram.com/viajandoconcabeza/"
    }
  ]
};

(function renderHomeContent() {
  const content = window.HOME_CONTENT;
  if (!content) return;

  document.querySelectorAll("[data-instagram-profile]").forEach((link) => {
    link.href = content.instagramProfile;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const tripsContainer = document.getElementById("latest-trips-content");
  if (tripsContainer) {
    tripsContainer.innerHTML = content.latestTrips.map((trip) => `
      <a class="trip-card" href="${trip.url}">
        <img src="${trip.image}" alt="${trip.title}">
        <svg class="heart"><use href="#i-heart"/></svg>
        <div class="shade"></div>
        <div class="trip-copy">
          <h3>${trip.title}</h3>
          <p>${trip.country}</p>
          <div><span>${trip.days}</span><span>${trip.people}</span><b>${trip.price}</b></div>
        </div>
      </a>
    `).join("");
  }

  const instagramGrid = document.getElementById("instagram-grid-content");
  if (instagramGrid) {
    instagramGrid.innerHTML = content.instagram.map((item, index) => `
      <a href="${item.url || content.instagramProfile}" target="_blank" rel="noopener noreferrer" aria-label="Ver publicación ${index + 1} en Instagram">
        <img src="${item.image}" alt="Instagram Viajando con Cabeza ${index + 1}">
      </a>
    `).join("");
  }

  const guide = content.featuredGuide;
  const guideContainer = document.getElementById("featured-guide-content");
  if (guideContainer && guide) {
    guideContainer.innerHTML = `
      <div class="rome-photo"><img src="${guide.image}" alt="${guide.title}"><span>${guide.badge}</span></div>
      <div class="rome-copy">
        <p>${guide.country}</p>
        <h2>${guide.title}</h2>
        <div class="rating">${guide.rating} <small>${guide.ratingText}</small></div>
        <p class="rome-desc">${guide.description}</p>
        <div class="rome-meta">${guide.meta.map((item) => `<span>${item}</span>`).join("")}</div>
        <a href="${guide.url}">VER GUÍA COMPLETA →</a>
      </div>
      <aside class="budget">
        <b>PRESUPUESTO REAL</b>
        <small>${guide.budgetSubtitle}</small>
        ${guide.budget.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
        <div class="total"><span>TOTAL</span><strong>${guide.total}</strong></div>
      </aside>
    `;
  }
})();
