// Lista de 10 Pokémon tipo Planta/Hierba
const grassPokemonList = [
    'bulbasaur',
    'chikorita',
    'treecko',
    'turtwig',
    'snivy',
    'chespin',
    'rowlet',
    'grookey',
    'sprigatito',
    'celebi'
];

const galleryContainer = document.getElementById('pokemon-gallery');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let totalCards = grassPokemonList.length;

// Obtener datos desde PokéAPI
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();

        const speciesResp = await fetch(data.species.url);
        const speciesData = await speciesResp.json();

        const spanishFlavor = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'es'
        );
        const flavorText = spanishFlavor 
            ? spanishFlavor.flavor_text.replace(/\f/g, ' ') 
            : 'Un Pokémon tipo planta muy poderoso en combate.';

        return {
            id: data.id.toString().padStart(4, '0'),
            name: data.name,
            hp: data.stats[0].base_stat * 2,
            height: (data.height / 10).toFixed(1),
            weight: (data.weight / 10).toFixed(1),
            image: data.sprites.other['official-artwork'].front_default,
            ability: data.abilities[0]?.ability.name.replace('-', ' ') || 'Clorofila',
            attackName: data.moves[0]?.move.name.replace('-', ' ') || 'Hojas Afiladas',
            attackDamage: data.stats[1].base_stat,
            flavorText: flavorText
        };
    } catch (error) {
        console.error(`Error al cargar datos de ${pokemonName}:`, error);
    }
}

// Crear carta HTML
function createPokemonCard(pokemon) {
    return `
        <div class="pokemon-card">
            <div class="card-header">
                <div>
                    <span class="stage-tag">BÁSICO</span>
                    <div class="pokemon-name">${pokemon.name}</div>
                </div>
                <div class="hp-container">
                    <span class="hp-label">PS</span>
                    <span class="hp-val">${pokemon.hp}</span>
                    <span class="type-icon">🌿</span>
                </div>
            </div>

            <div class="image-frame">
                <img class="pokemon-img" src="${pokemon.image}" alt="${pokemon.name}">
            </div>

            <div class="info-bar">
                N.° ${pokemon.id} Pokémon Planta  Altura: ${pokemon.height} m  Peso: ${pokemon.weight} kg
            </div>

            <div class="abilities-attacks">
                <div class="ability-box">
                    <div class="ability-header">
                        <span class="ability-badge">Habilidad</span>
                        <span class="ability-title">${pokemon.ability.toUpperCase()}</span>
                    </div>
                    <p class="ability-desc">Reduce el daño recibido por ataques del rival mientras este Pokémon se mantenga en combate.</p>
                </div>

                <div class="attack-box">
                    <div class="attack-cost">
                        <span class="type-icon">🌿</span>
                        <span class="type-icon" style="background-color:#ccc; color:#333;">★</span>
                    </div>
                    <span class="attack-name">${pokemon.attackName}</span>
                    <span class="attack-damage">${pokemon.attackDamage}</span>
                </div>
            </div>

            <div class="card-footer">
                <div class="stats-row">
                    <span>Debilidad: 🔥 x2</span>
                    <span>Resistencia: 💧 -30</span>
                    <span>Retirada: 🌿</span>
                </div>
                <div class="flavor-text">
                    "${pokemon.flavorText}"
                </div>
            </div>
        </div>
    `;
}

// Lógica de movimiento del Carrusel
function updateCarousel() {
    const cardWidth = 340; // Ancho de la carta + gap
    galleryContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Actualizar estado activo de los puntos
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Generar puntos navegables (Dots)
function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }
}

// Eventos de botones prev/next
prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
    updateCarousel();
});

// Renderizar todo
async function renderGallery() {
    galleryContainer.innerHTML = '';
    for (const name of grassPokemonList) {
        const pokemon = await fetchPokemonData(name);
        if (pokemon) {
            galleryContainer.innerHTML += createPokemonCard(pokemon);
        }
    }
    createDots();
}

renderGallery();