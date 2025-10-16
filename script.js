// --- ANIMASI PREMIUM: FADE-IN & SLIDE-UP ON SCROLL (AOS TIRUAN) ---

document.addEventListener('DOMContentLoaded', () => {
    // Setup search functionality
    setupSearch();

    // 1. Terapkan Animasi Dasar saat Load (Mirip hero section Hostinger)
    const elementsToFadeIn = document.querySelectorAll('.animate-fade-in');
    elementsToFadeIn.forEach((el, index) => {
        setTimeout(() => {
            el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }, index * 200 + 50); // Tambahkan delay
    });

    // 2. Observer untuk Animasi On Scroll (Untuk Card Tips)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delayClass = Array.from(element.classList).find(cls => cls.startsWith('delay-'));
                const delayValue = delayClass ? parseInt(delayClass.split('-')[1]) * 150 : 0; // delay in ms

                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    element.style.opacity = 1;
                    element.style.transform = 'translateY(0)';
                }, delayValue);

                observer.unobserve(element); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1 // Mulai animasi ketika 10% elemen terlihat
    });

    // Temukan semua elemen yang akan dianimasikan saat scroll (kartu tips)
    const cardsToAnimate = document.querySelectorAll('.animate-on-scroll');
    cardsToAnimate.forEach(card => {
        // Atur posisi awal (sudah diatur di CSS, tapi kita ulangi untuk memastikan)
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';

        observer.observe(card);
    });

    // 3. Animasi untuk Hero Section (Pengaturan Awal)
    // Pastikan elemen Hero dimulai tersembunyi untuk animasi fade-in
    document.querySelector('.hero-section h1').style.opacity = 0;
    document.querySelector('.hero-section h1').style.transform = 'translateY(10px)';

    document.querySelector('.hero-section p').classList.add('animate-fade-in-delay');
    document.querySelector('.hero-section p').style.opacity = 0;
    document.querySelector('.hero-section p').style.transform = 'translateY(10px)';

    document.querySelector('.cta-group').classList.add('animate-fade-in-delay');
    document.querySelector('.cta-group').style.opacity = 0;
    document.querySelector('.cta-group').style.transform = 'translateY(10px)';

    // Jalankan Animasi Hero
    setTimeout(() => {
        document.querySelector('.hero-section h1').style.opacity = 1;
        document.querySelector('.hero-section h1').style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        document.querySelector('.hero-section p').style.opacity = 1;
        document.querySelector('.hero-section p').style.transform = 'translateY(0)';
    }, 250); // Delay sedikit

    setTimeout(() => {
        document.querySelector('.cta-group').style.opacity = 1;
        document.querySelector('.cta-group').style.transform = 'translateY(0)';
    }, 450); // Delay lebih jauh untuk CTA
});

// Search functionality for index.html and proyek.html
function setupSearch() {
    // Search in index.html (redirect to proyek.html with query parameter)
    const searchBarIndex = document.querySelector('.search-section .search-bar input');
    const searchBtnIndex = document.querySelector('.search-section .btn-search');
    if (searchBarIndex && searchBtnIndex) {
        const performSearchIndex = () => {
            const query = searchBarIndex.value.trim();
            if (query) {
                window.location.href = `proyek.html?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = 'proyek.html';
            }
        };
        searchBtnIndex.addEventListener('click', performSearchIndex);
        searchBarIndex.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearchIndex();
            }
        });

        // Add cancel button for index.html search
        const searchContainerIndex = searchBarIndex.closest('.search-bar');
        if (searchContainerIndex && !searchContainerIndex.querySelector('.btn-cancel')) {
            const cancelBtnIndex = document.createElement('button');
            cancelBtnIndex.className = 'btn btn-cancel';
            cancelBtnIndex.textContent = 'Cancel';
            cancelBtnIndex.addEventListener('click', () => {
                searchBarIndex.value = '';
            });
            searchContainerIndex.appendChild(cancelBtnIndex);
        }
    }

    // Search in proyek.html (filter table rows based on URL parameter or input)
    const searchBarProyek = document.querySelector('.comparison-section .search-bar input');
    const searchBtnProyek = document.querySelector('.comparison-section .btn-search');

    // Check for URL parameter on page load
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchBarProyek) {
        searchBarProyek.value = searchQuery;
        filterTable(searchQuery.toLowerCase());
    }

    if (searchBarProyek && searchBtnProyek) {
        const performSearchProyek = () => {
            const query = searchBarProyek.value.toLowerCase();
            filterTable(query);
        };
        searchBtnProyek.addEventListener('click', performSearchProyek);
        searchBarProyek.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearchProyek();
            }
        });

        // Add cancel button if not exists
        const searchContainer = searchBarProyek.closest('.search-bar');
        if (searchContainer && !searchContainer.querySelector('.btn-cancel')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-cancel';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => {
                searchBarProyek.value = '';
                // Show all table rows
                const tableRows = document.querySelectorAll('.comparison-table .table-row');
                tableRows.forEach(row => {
                    row.style.display = 'grid'; // Use grid to maintain table layout
                });
            });
            searchContainer.appendChild(cancelBtn);
        }
    }
}

function filterTable(query) {
    const tableRows = document.querySelectorAll('.comparison-table .table-row:not(.table-header)');
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? 'grid' : 'none';
    });
}

// Slideshow functionality for pacar.html and index.html
let slideIndex = 0;
let slides = document.querySelectorAll('.slideshow img');
let dots = document.querySelectorAll('.dot');
let autoSlideInterval;
let isTransitioning = false;

function showSlides() {
    if (slides.length === 0) return;

    // Hide all slides with fade out
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.display = 'none';
        slide.style.opacity = '0';
    });

    // Show current slide with fade in
    setTimeout(() => {
        slides[slideIndex].style.display = 'block';
        slides[slideIndex].classList.add('active');
        slides[slideIndex].style.opacity = '1';
    }, 250); // Half of transition time

    // Update dots
    if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex].classList.add('active');
    }
}

function changeSlide(n) {
    if (isTransitioning) return;
    isTransitioning = true;

    slideIndex += n;
    if (slideIndex >= slides.length) { slideIndex = 0; }
    if (slideIndex < 0) { slideIndex = slides.length - 1; }
    showSlides();

    setTimeout(() => {
        isTransitioning = false;
    }, 800); // Match transition duration
}

function currentSlide(n) {
    if (isTransitioning) return;
    slideIndex = n - 1;
    changeSlide(0);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 4000); // Change slide every 4 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Touch events for mobile (swipe with finger)
let startX;
let startY;
let endX;
let endY;
let isSwiping = false;

if (document.querySelector('.slideshow')) {
    showSlides();
    startAutoSlide();

    // Touch events for swipe
    document.querySelector('.slideshow-container').addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        stopAutoSlide(); // Pause auto slide during swipe
    }, { passive: true });

    document.querySelector('.slideshow-container').addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        endX = e.touches[0].clientX;
        endY = e.touches[0].clientY;
    }, { passive: true });

    document.querySelector('.slideshow-container').addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;

        let diffX = startX - endX;
        let diffY = startY - endY;

        // Check if it's a horizontal swipe (not vertical)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                changeSlide(1); // Swipe left - next slide
            } else {
                changeSlide(-1); // Swipe right - previous slide
            }
        }

        startAutoSlide(); // Resume auto slide after swipe
    }, { passive: true });

    // Pause auto slide on hover
    document.querySelector('.slideshow-container').addEventListener('mouseenter', stopAutoSlide);
    document.querySelector('.slideshow-container').addEventListener('mouseleave', startAutoSlide);

    // Add dots if they exist
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => currentSlide(index + 1));
        });
    }
}
