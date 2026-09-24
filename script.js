// Force browser to start at top of page on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Target Wedding Date (Bhilwara)
const targetDate = new Date("November 23, 2026 10:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  const badge = document.getElementById("countdown-badge");
  if (!badge) return;

  if (diff <= 0) {
    badge.innerText = "Celebrations are live!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  badge.innerText = `${days}d • ${hours}h • ${minutes}m to go`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- 3D Bifold Envelope Tap-to-Open & Confetti Burst ---
const weddingCard = document.getElementById("wedding-card");
const musicToggle = document.getElementById("music-toggle");
const audio = document.getElementById("bg-audio");
const nextBtn = document.getElementById("next-btn");

function triggerConfettiBurst() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#d4af37", "#ffd700", "#b8860b", "#f06292", "#e91e63", "#ffffff"];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.alpha -= 0.015;
      p.rotation += p.rotSpeed;

      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function handleCardOpen() {
  if (!weddingCard) return;

  const wasClosed = !weddingCard.classList.contains("is-open");
  weddingCard.classList.add("is-open");

  if (wasClosed) {
    document.body.classList.remove("scroll-locked");
    document.documentElement.classList.remove("scroll-locked");

    triggerConfettiBurst();

    if (audio && audio.paused) {
      audio.play().then(() => {
        if (musicToggle) musicToggle.innerText = "⏸ PAUSE MUSIC";
      }).catch(err => {
        console.log("Audio waiting for user gesture:", err);
      });
    }

    setTimeout(() => {
      window.scrollBy({
        top: 80,
        behavior: "smooth"
      });
    }, 400);
  }
}

if (weddingCard) {
  weddingCard.addEventListener("click", handleCardOpen);
}

// "SCROLL NEXT" Button Handler
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (document.body.classList.contains("scroll-locked")) {
      handleCardOpen();
    } else {
      window.scrollBy({
        top: window.innerHeight * 0.85,
        behavior: "smooth"
      });
    }
  });
}

// Intersection Observer for Slide Animations
const revealSections = document.querySelectorAll(".reveal, .feed-card-section");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.12 });

revealSections.forEach(sec => observer.observe(sec));

// ==========================================================
// 3D COVERFLOW DRESS CODE CAROUSEL ENGINE
// ==========================================================
(function initCoverflow() {
  const cards = Array.from(document.querySelectorAll(".coverflow-card"));
  const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));
  const prevBtn = document.getElementById("prev-card-btn");
  const nextBtn = document.getElementById("next-card-btn");
  const stage = document.getElementById("coverflow-stage");

  if (!cards.length || !stage) return;

  let currentIndex = 0;
  const total = cards.length;

  function renderCarousel() {
    cards.forEach((card, i) => {
      const diff = i - currentIndex;

      if (diff === 0) {
        // Active Center Card
        card.style.transform = `translateX(0) scale(1) translateZ(0)`;
        card.style.opacity = "1";
        card.style.filter = "none";
        card.style.zIndex = "25";
        card.style.pointerEvents = "auto";
      } else if (diff === -1) {
        // Left Flanking Card
        card.style.transform = `translateX(-54%) scale(0.82) rotateY(16deg)`;
        card.style.opacity = "0.72";
        card.style.filter = "brightness(0.92)";
        card.style.zIndex = "15";
        card.style.pointerEvents = "auto";
      } else if (diff === 1) {
        // Right Flanking Card
        card.style.transform = `translateX(54%) scale(0.82) rotateY(-16deg)`;
        card.style.opacity = "0.72";
        card.style.filter = "brightness(0.92)";
        card.style.zIndex = "15";
        card.style.pointerEvents = "auto";
      } else {
        // Far Cards
        const direction = diff > 0 ? 1 : -1;
        card.style.transform = `translateX(${direction * 90}%) scale(0.68)`;
        card.style.opacity = "0";
        card.style.zIndex = "5";
        card.style.pointerEvents = "none";
      }
    });

    // Update Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = 0;
    } else if (index >= total) {
      currentIndex = total - 1;
    } else {
      currentIndex = index;
    }
    renderCarousel();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSlide(currentIndex > 0 ? currentIndex - 1 : total - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSlide(currentIndex < total - 1 ? currentIndex + 1 : 0);
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (currentIndex !== index) {
        goToSlide(index);
      }
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToSlide(currentIndex > 0 ? currentIndex - 1 : total - 1);
      } else {
        goToSlide(currentIndex < total - 1 ? currentIndex + 1 : 0);
      }
    }
  }, { passive: true });

  renderCarousel();
})();

// Audio Toggle Button
if (musicToggle && audio) {
  musicToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        musicToggle.innerText = "⏸ PAUSE MUSIC";
      }).catch(err => console.log("Audio click required:", err));
    } else {
      audio.pause();
      musicToggle.innerText = "🔊 PLAY MUSIC";
    }
  });
}

// Native Share API
const shareBtn = document.getElementById("share-btn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Saurabh & Aayushi | Wedding Lookbook",
          text: "Check out the official wedding attire guide & itinerary!",
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied to clipboard!");
    }
  });
}

// Google Calendar Link
const calBtn = document.getElementById("cal-btn");
if (calBtn) {
  calBtn.addEventListener("click", () => {
    window.open(
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Saurabh+%26+Aayushi+Wedding&dates=20261123T043000Z/20261126T183000Z&details=Wedding+Celebrations+at+The+Aaureum+Resort,+Bhilwara&location=The+Aaureum+Resort,+Bhilwara",
      "_blank"
    );
  });
}

// Canvas Falling Rose Petals Engine
(function initPetals() {
  const canvas = document.getElementById("rose-petals");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalColors = [
    { fill: "#f48fb1", shadow: "#e91e63" },
    { fill: "#f06292", shadow: "#c2185b" },
    { fill: "#e57373", shadow: "#b71c1c" },
    { fill: "#ffcdd2", shadow: "#f48fb1" }
  ];

  const TOTAL_PETALS = Math.min(Math.floor(window.innerWidth / 16), 30);
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = 11 + Math.random() * 13;
      this.speedY = 0.8 + Math.random() * 1.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.8;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = 0.02 + Math.random() * 0.03;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = 0.65 + Math.random() * 0.3;
      this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
      this.wobble += 0.02;
      this.x += Math.sin(this.wobble) * 0.9 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 30 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.cos(this.flip));

      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(
        this.size / 1.4, -this.size / 2,
        this.size / 1.4,  this.size / 2,
        0,                this.size
      );
      ctx.bezierCurveTo(
        -this.size / 1.4, this.size / 2,
        -this.size / 1.4, -this.size / 2,
        0,                -this.size / 2
      );

      ctx.fillStyle = this.color.fill;
      ctx.globalAlpha = this.opacity;
      ctx.shadowColor = this.color.shadow;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
})();