(function () {
  "use strict";

  const CARDS_PER_ROUND = 10;

  // State
  let currentCards = [];
  let currentIndex = 0;
  let results = []; // { chore, answer: "husband"|"wife"|"neither" }
  let usedIndices = new Set();

  // DOM
  const screenStart = document.getElementById("screen-start");
  const screenCards = document.getElementById("screen-cards");
  const screenResult = document.getElementById("screen-result");
  const cardContainer = document.getElementById("card-container");
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const btnStart = document.getElementById("btn-start");
  const btnRetry = document.getElementById("btn-retry");
  const btnHusband = document.getElementById("btn-husband");
  const btnWife = document.getElementById("btn-wife");
  const btnNeither = document.getElementById("btn-neither");

  // --- Screen transitions ---
  function showScreen(screen) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    screen.classList.add("active");
  }

  // --- Card selection ---
  function pickRandomCards() {
    const available = [];
    for (let i = 0; i < CHORES.length; i++) {
      if (!usedIndices.has(i)) available.push(i);
    }
    // Reset if not enough cards left
    if (available.length < CARDS_PER_ROUND) {
      usedIndices.clear();
      for (let i = 0; i < CHORES.length; i++) available.push(i);
    }
    // Shuffle and pick
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    const picked = available.slice(0, CARDS_PER_ROUND);
    picked.forEach((i) => usedIndices.add(i));
    return picked.map((i) => CHORES[i]);
  }

  // --- Card rendering ---
  function createCardElement(chore, index) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = index;
    card.style.zIndex = CARDS_PER_ROUND - index;
    if (index > 0) {
      card.style.transform = `scale(${1 - index * 0.03}) translateY(${index * 8}px)`;
      card.style.opacity = index < 3 ? 1 : 0;
    }
    card.innerHTML = `
      <div class="card-category">${chore.category}</div>
      <div class="card-text">${chore.text}</div>
      <div class="card-hint">スワイプで振り分け</div>
      <div class="card-overlay card-overlay-left">🧑 夫</div>
      <div class="card-overlay card-overlay-right">👩 妻</div>
      <div class="card-overlay card-overlay-down">✕ なし</div>
    `;
    return card;
  }

  function renderCards() {
    cardContainer.innerHTML = "";
    currentCards.forEach((chore, i) => {
      const card = createCardElement(chore, i);
      cardContainer.appendChild(card);
    });
    updateProgress();
    setupSwipe();
  }

  function updateProgress() {
    const done = currentIndex;
    progressFill.style.width = `${(done / CARDS_PER_ROUND) * 100}%`;
    progressText.textContent = `${Math.min(done + 1, CARDS_PER_ROUND)} / ${CARDS_PER_ROUND}`;
  }

  // --- Swipe logic ---
  function setupSwipe() {
    const topCard = cardContainer.querySelector(`.card[data-index="${currentIndex}"]`);
    if (!topCard) return;
    topCard.classList.add("card-active");

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    function onStart(e) {
      isDragging = true;
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      topCard.style.transition = "none";
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      currentX = point.clientX - startX;
      currentY = point.clientY - startY;

      const rotate = currentX * 0.1;
      topCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

      // Show overlays
      const overlayLeft = topCard.querySelector(".card-overlay-left");
      const overlayRight = topCard.querySelector(".card-overlay-right");
      const overlayDown = topCard.querySelector(".card-overlay-down");

      const threshold = 50;
      overlayLeft.style.opacity = currentX < -threshold ? Math.min((-currentX - threshold) / 60, 1) : 0;
      overlayRight.style.opacity = currentX > threshold ? Math.min((currentX - threshold) / 60, 1) : 0;
      overlayDown.style.opacity = currentY > threshold && Math.abs(currentX) < threshold ? Math.min((currentY - threshold) / 60, 1) : 0;
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;

      const swipeThreshold = 80;

      if (currentX < -swipeThreshold) {
        recordAnswer("husband");
        flyAway("left");
      } else if (currentX > swipeThreshold) {
        recordAnswer("wife");
        flyAway("right");
      } else if (currentY > swipeThreshold && Math.abs(currentX) < swipeThreshold) {
        recordAnswer("neither");
        flyAway("down");
      } else {
        // Snap back
        topCard.style.transition = "transform 0.3s ease";
        topCard.style.transform = "";
        topCard.querySelectorAll(".card-overlay").forEach((o) => (o.style.opacity = 0));
      }

      currentX = 0;
      currentY = 0;
    }

    topCard.addEventListener("touchstart", onStart, { passive: true });
    topCard.addEventListener("touchmove", onMove, { passive: false });
    topCard.addEventListener("touchend", onEnd);
    topCard.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    // Store cleanup function
    topCard._cleanup = () => {
      topCard.removeEventListener("touchstart", onStart);
      topCard.removeEventListener("touchmove", onMove);
      topCard.removeEventListener("touchend", onEnd);
      topCard.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
    };
  }

  function flyAway(direction) {
    const topCard = cardContainer.querySelector(`.card[data-index="${currentIndex}"]`);
    if (!topCard) return;
    if (topCard._cleanup) topCard._cleanup();

    topCard.style.transition = "transform 0.4s ease, opacity 0.4s ease";
    if (direction === "left") {
      topCard.style.transform = "translate(-150vw, 0) rotate(-30deg)";
    } else if (direction === "right") {
      topCard.style.transform = "translate(150vw, 0) rotate(30deg)";
    } else {
      topCard.style.transform = "translate(0, 150vh)";
    }
    topCard.style.opacity = "0";

    currentIndex++;

    // Promote next cards visually
    for (let i = currentIndex; i < currentCards.length && i < currentIndex + 3; i++) {
      const card = cardContainer.querySelector(`.card[data-index="${i}"]`);
      if (card) {
        const offset = i - currentIndex;
        card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
        card.style.transform = `scale(${1 - offset * 0.03}) translateY(${offset * 8}px)`;
        card.style.opacity = 1;
      }
    }

    if (currentIndex >= CARDS_PER_ROUND) {
      setTimeout(showResult, 500);
    } else {
      updateProgress();
      setTimeout(setupSwipe, 300);
    }
  }

  function recordAnswer(answer) {
    results.push({
      chore: currentCards[currentIndex],
      answer: answer,
    });
  }

  // --- Button handlers ---
  function handleButton(answer) {
    const direction = answer === "husband" ? "left" : answer === "wife" ? "right" : "down";
    recordAnswer(answer);
    flyAway(direction);
  }
  // --- Result screen ---
  function showResult() {
    const roundResults = results.slice(-CARDS_PER_ROUND);
    let husband = 0, wife = 0, neither = 0;
    roundResults.forEach((r) => {
      if (r.answer === "husband") husband++;
      else if (r.answer === "wife") wife++;
      else neither++;
    });

    const maxCount = Math.max(husband, wife, neither, 1);
    document.getElementById("bar-husband").style.width = `${(husband / maxCount) * 100}%`;
    document.getElementById("bar-wife").style.width = `${(wife / maxCount) * 100}%`;
    document.getElementById("bar-neither").style.width = `${(neither / maxCount) * 100}%`;
    document.getElementById("count-husband").textContent = husband;
    document.getElementById("count-wife").textContent = wife;
    document.getElementById("count-neither").textContent = neither;

    // Message
    const msgEl = document.getElementById("result-message");
    const diff = Math.abs(husband - wife);
    if (diff <= 1) {
      msgEl.textContent = "ほぼ均等！素晴らしいバランスです。";
    } else if (husband > wife) {
      msgEl.textContent = `夫の方が ${diff} つ多く担当しているようです。`;
    } else {
      msgEl.textContent = `妻の方が ${diff} つ多く担当しているようです。`;
    }
    if (neither >= 3) {
      msgEl.textContent += `\n「どちらもやっていない」が ${neither} つ。ここに改善のヒントがあるかも？`;
    }

    // Detail list
    const listEl = document.getElementById("result-list");
    listEl.innerHTML = "";
    roundResults.forEach((r) => {
      const item = document.createElement("div");
      item.className = `result-item result-item-${r.answer}`;
      const icon = r.answer === "husband" ? "🧑" : r.answer === "wife" ? "👩" : "✕";
      item.innerHTML = `<span class="result-item-icon">${icon}</span><span class="result-item-text">${r.chore.text}</span>`;
      listEl.appendChild(item);
    });

    showScreen(screenResult);

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll(".result-bar").forEach((bar) => {
        bar.classList.add("animated");
      });
    }, 100);
  }

  // --- Start / Retry ---
  function startRound() {
    currentCards = pickRandomCards();
    currentIndex = 0;
    renderCards();
    showScreen(screenCards);
  }

  // --- Event listeners ---
  btnStart.addEventListener("click", startRound);
  btnRetry.addEventListener("click", startRound);
  btnHusband.addEventListener("click", () => handleButton("husband"));
  btnWife.addEventListener("click", () => handleButton("wife"));
  btnNeither.addEventListener("click", () => handleButton("neither"));
})();
