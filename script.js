const roles = ["Data Scientist", "ML Engineer", "AI Systems Builder"];
const typeTarget = document.querySelector("#typewriter");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  typeTarget.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

  if (!deleting && charIndex > current.length + 8) {
    deleting = true;
  }

  if (deleting && charIndex < 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
  }

  window.setTimeout(typeLoop, deleting ? 45 : 82);
}

typeLoop();

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      const suffix = target.dataset.suffix || "+";
      let value = 0;
      const step = Math.max(1, Math.ceil(finalValue / 32));
      const timer = window.setInterval(() => {
        value = Math.min(finalValue, value + step);
        target.textContent = `${value}${suffix}`;
        if (value >= finalValue) window.clearInterval(timer);
      }, 32);
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const canvas = document.querySelector("#particle-canvas");
const context = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const hero = document.querySelector(".hero");
  const rect = hero.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  particles = Array.from({ length: Math.min(72, Math.floor(rect.width / 15)) }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.7 + 0.8,
  }));
}

function drawParticles() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    context.fillStyle = "rgba(0, 245, 255, 0.58)";
    context.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 120) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(59, 130, 246, ${0.16 * (1 - distance / 120)})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  });

  window.requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);
