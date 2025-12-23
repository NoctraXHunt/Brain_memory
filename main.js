const emojis = ['⚡', '💎', '🧬', '🔮', '🪐', '🤖', '👾', '🚀'];
        const cardsArray = [...emojis, ...emojis];
        
        let moves = 0;
        let matchedPairs = 0;
        let hasFlippedCard = false;
        let lockBoard = false;
        let firstCard, secondCard;
        let timerInterval;
        let seconds = 0;
        let gameStarted = false;

        const board = document.getElementById('gameBoard');
        const movesDisplay = document.getElementById('moves');
        const timerDisplay = document.getElementById('timer');
        const winOverlay = document.getElementById('winOverlay');
        const finalMoves = document.getElementById('finalMoves');
        const finalTime = document.getElementById('finalTime');


        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function createBoard() {
            board.innerHTML = '';
            shuffle(cardsArray).forEach(emoji => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.value = emoji;

                const frontFace = document.createElement('div');
                frontFace.classList.add('card-face', 'card-front');

                const backFace = document.createElement('div');
                backFace.classList.add('card-face', 'card-back');
                backFace.innerText = emoji;

                card.appendChild(frontFace);
                card.appendChild(backFace);
                card.addEventListener('click', flipCard);
                board.appendChild(card);
            });
        }

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;

            if (!gameStarted) startTimer();

            this.classList.add('flipped');

            if (!hasFlippedCard) {
                hasFlippedCard = true;
                firstCard = this;
                return;
            }

            secondCard = this;
            incrementMoves();
            checkForMatch();
        }

        function checkForMatch() {
            let isMatch = firstCard.dataset.value === secondCard.dataset.value;
            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            resetBoard();
            
            matchedPairs++;
            if (matchedPairs === emojis.length) {
                setTimeout(endGame, 500);
            }
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.add('shake');
                secondCard.classList.add('shake');
            }, 400);

            setTimeout(() => {
                firstCard.classList.remove('flipped', 'shake');
                secondCard.classList.remove('flipped', 'shake');
                resetBoard();
            }, 1000);
        }

        function resetBoard() {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null];
        }

        function incrementMoves() {
            moves++;
            movesDisplay.innerText = moves;
        }

        function startTimer() {
            gameStarted = true;
            timerInterval = setInterval(() => {
                seconds++;
                const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                const secs = (seconds % 60).toString().padStart(2, '0');
                timerDisplay.innerText = `${mins}:${secs}`;
            }, 1000);
        }

        function stopTimer() {
            clearInterval(timerInterval);
        }

        function endGame() {
            stopTimer();
            finalMoves.innerText = moves;
            finalTime.innerText = timerDisplay.innerText;
            winOverlay.classList.add('active');
            createConfetti();
        }

        function restartGame() {
            winOverlay.classList.remove('active');
            moves = 0;
            matchedPairs = 0;
            seconds = 0;
            gameStarted = false;
            stopTimer();
            movesDisplay.innerText = '0';
            timerDisplay.innerText = '00:00';
            
            document.querySelectorAll('.confetti').forEach(e => e.remove());
            
            createBoard();
        }

        function createConfetti() {
            const colors = ['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981'];
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
            }
        }

        createBoard();