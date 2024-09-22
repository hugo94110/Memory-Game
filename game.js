const cards = [
    { src: 'assets/camel.png', alt: 'Carte Camel' },
    { src: 'assets/camel.png', alt: 'Carte Camel' },
    { src: 'assets/hen.png', alt: 'Carte Hen' },
    { src: 'assets/hen.png', alt: 'Carte Hen' },
    { src: 'assets/hippopotamus.png', alt: 'Carte Hippopotamus' },
    { src: 'assets/hippopotamus.png', alt: 'Carte Hippopotamus' },
    { src: 'assets/ladybug.png', alt: 'Carte Ladybug' },
    { src: 'assets/ladybug.png', alt: 'Carte Ladybug' },
    { src: 'assets/monkey.png', alt: 'Carte Monkey' },
    { src: 'assets/monkey.png', alt: 'Carte Monkey' },
    { src: 'assets/panda-bear.png', alt: 'Carte Panda' },
    { src: 'assets/panda-bear.png', alt: 'Carte Panda' }
];

//Fonction pour mélanger les cartes (algorithme de Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const missElement = document.querySelector('.player-stats-container p:nth-child(2)'); //Misse(s)
const moveElement = document.querySelector('.player-stats-container p:nth-child(4)'); //Move(s)
const winElement = document.querySelector('.player-stats-container p:nth-child(6)');  //Win(s)

//Mise en place des variables
let misses = 0;
let moves = 0;
let wins = 0;
let flippedCards = [];
let matchedCards = 0;
let freezeBoard = false;

function initGame() {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = '';

    misses = 0;
    moves = 0;
    matchedCards = 0;
    freezeBoard = false;
    flippedCards = [];

    missElement.textContent = misses;
    moveElement.textContent = moves;

    //Mélanger les cartes
    const shuffledCards = shuffle(cards);

    //Ajouter les cartes mélangées dans le DOM
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('article');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;

        const imgElement = document.createElement('img');
        imgElement.src = 'assets/back.png'; //Image de dos au départ
        imgElement.alt = card.alt;
        imgElement.dataset.src = card.src;

        cardElement.appendChild(imgElement);
        cardContainer.appendChild(cardElement);

        //Ajouter un écouteur d'événements pour gérer le clic
        cardElement.addEventListener('click', handleCardClick);
    });
}

function handleCardClick(e) {
    if (freezeBoard) return;
    const clickedCard = e.currentTarget;
    const imgElement = clickedCard.querySelector('img');

    if (imgElement.src === imgElement.dataset.src) return;

    imgElement.src = imgElement.dataset.src;
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        freezeBoard = true;
        checkForMatch();
    }
}

//Fonction pour vérifier si deux cartes sont identiques
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    const firstImage = firstCard.querySelector('img').dataset.src;
    const secondImage = secondCard.querySelector('img').dataset.src;

    if (firstImage === secondImage) {
        matchedCards += 2;
        moves++; //Incrémenter les mouvements réussi
        moveElement.textContent = moves;
        resetBoard();

        //Vérifier si la partie est gagnée
        if (matchedCards === cards.length) {
            wins++; //Incrémenter les victoires
            winElement.textContent = wins;
            setTimeout(() => {
                alert('Congratulations, you\'ve won with '+misses+' misse(s) and '+moves+' move(s)');
                initGame();
            }, 500);
        }
    } else {
        //Les cartes ne correspondent pas
        misses++; //Incrémenter les mises
        missElement.textContent = misses;
        setTimeout(() => {
            firstCard.querySelector('img').src = 'assets/back.png';
            secondCard.querySelector('img').src = 'assets/back.png';
            resetBoard();
        }, 1000);
    }
}

//Réinitialiser l'état après chaque essai
function resetBoard() {
    flippedCards = [];
    freezeBoard = false;
}

//Initialiser le jeu à la première ouverture
initGame(); 