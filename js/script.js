const toggleBtn = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const icon = toggleBtn.querySelector('.menu-icon');

function toggleMenu(open) {
  if (open) {
    mobileMenu.style.display = "block";
    requestAnimationFrame(() => {
      mobileMenu.classList.add('open');
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    });
  } else {
    mobileMenu.classList.remove('open');
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
    mobileMenu.addEventListener('transitionend', function handler() {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = "none";
      }
      mobileMenu.removeEventListener('transitionend', handler);
    });
  }
}

toggleBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  toggleMenu(!isOpen);
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    toggleMenu(false);
  });
});

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
    if (mobileMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  }
});



const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("show");
      }, index * 200);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => observer.observe(el));



const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');

const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      el.classList.add('show');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

const track = document.querySelector('.carousel-track');
const originalItems = Array.from(document.querySelectorAll('.carousel-item'));
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const dots = document.querySelectorAll('.dot');

const visibleCards = 3;
const totalOriginal = originalItems.length;
let currentIndex = 0;

originalItems.forEach(item => {
  const clone = item.cloneNode(true);
  track.appendChild(clone);
});

const allItems = document.querySelectorAll('.carousel-item');

let itemWidth;

function updateItemWidth() {
  itemWidth = originalItems[0].offsetWidth + 30;
}

updateItemWidth();

window.addEventListener("resize", () => {
  updateItemWidth();
  moveCarousel(false);
});

function moveCarousel(animate = true) {
  track.style.transition = animate ? "transform 0.4s ease" : "none";
  track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

  const safeIndex = ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === safeIndex);
  });
}

function goNext() {
  currentIndex++;
  moveCarousel(true);

  if (currentIndex === totalOriginal) {
    setTimeout(() => {
      currentIndex = 0;
      moveCarousel(false);
    }, 400);
  }
}

function goPrev() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = totalOriginal - 1;
    moveCarousel(false);
    return;
  }

  moveCarousel(true);
}

nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentIndex = i;
    moveCarousel(true);
  });
});


setInterval(goNext, 4000);

let dragStart = 0;
let dragging = false;
let prevTranslate = 0;

track.addEventListener("mousedown", (e) => {
  dragging = true;
  dragStart = e.pageX;
  prevTranslate = -currentIndex * itemWidth;
  track.style.transition = "none";
});

track.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const diff = e.pageX - dragStart;
  track.style.transform = `translateX(${prevTranslate + diff}px)`;
});

track.addEventListener("mouseup", (e) => {
  if (!dragging) return;
  dragging = false;
  const diff = e.pageX - dragStart;
  if (diff < -80) goNext();
  else if (diff > 80) goPrev();
  else moveCarousel(true);
});

track.addEventListener("mouseleave", () => {
  if (dragging) {
    dragging = false;
    moveCarousel(true);
  }
});

track.addEventListener("touchstart", (e) => {
  dragging = true;
  dragStart = e.touches[0].clientX;
  prevTranslate = -currentIndex * itemWidth;
  track.style.transition = "none";
});

track.addEventListener("touchmove", (e) => {
  if (!dragging) return;
  const diff = e.touches[0].clientX - dragStart;
  track.style.transform = `translateX(${prevTranslate + diff}px)`;
});

track.addEventListener("touchend", (e) => {
  if (!dragging) return;
  dragging = false;
  const diff = e.changedTouches[0].clientX - dragStart;
  if (diff < -80) goNext();
  else if (diff > 80) goPrev();
  else moveCarousel(true);
});

moveCarousel(false);

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove('open');
    toggleBtn.classList.remove('active');
    mobileMenu.style.display = "none";
  }
});
