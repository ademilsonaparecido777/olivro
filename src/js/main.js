'use strict';

/**
 * O LIVRO — LANDING PAGE INSTITUCIONAL (olivro.shop)
 * Módulo de interatividade Vanilla JS (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. MENU MOBILE & NAVEGAÇÃO ACESSÍVEL
  // ------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && mainNav) {
    function toggleMenu(show) {
      const isExpanded = show !== undefined
        ? show
        : mobileToggleBtn.getAttribute('aria-expanded') !== 'true';

      mobileToggleBtn.setAttribute('aria-expanded', isExpanded);
      mainNav.classList.toggle('active', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';

      const menuIcon = mobileToggleBtn.querySelector('.menu-icon');
      const closeIcon = mobileToggleBtn.querySelector('.close-icon');

      if (menuIcon && closeIcon) {
        menuIcon.style.display = isExpanded ? 'none' : 'block';
        closeIcon.style.display = isExpanded ? 'block' : 'none';
      }
    }

    mobileToggleBtn.addEventListener('click', () => toggleMenu());

    // Fechar ao clicar num link de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });

    // Fechar menu com a tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        toggleMenu(false);
        mobileToggleBtn.focus();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. FILTRO DE ACERVO / CATEGORIAS (PESQUISA)
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.tab-btn');
  const catalogCards = document.querySelectorAll('.catalog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Atualizar estados dos botões
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filtrar cartões
      catalogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', 'true');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 3. MODAL INSTITUCIONAL ("SOBRE O ECOSSISTEMA")
  // ------------------------------------------------------------------------
  const modalOverlay = document.getElementById('institutional-modal');
  const modalOpenBtns = document.querySelectorAll('[data-open-modal]');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  let previouslyFocusedElement = null;

  function openModal(title, bodyText) {
    if (!modalOverlay) return;

    previouslyFocusedElement = document.activeElement;

    if (title) {
      const modalTitleEl = modalOverlay.querySelector('.modal-title');

      if (modalTitleEl) {
        modalTitleEl.textContent = title;
      }
    }

    if (bodyText) {
      const modalBodyEl = modalOverlay.querySelector('.modal-body');

      if (modalBodyEl) {
        modalBodyEl.innerHTML = bodyText;
      }
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focar no botão de fechar para acessibilidade
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');

    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal() {
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  modalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const customTitle = btn.getAttribute('data-modal-title');
      const customContent = btn.getAttribute('data-modal-content');

      openModal(customTitle, customContent);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        modalOverlay.classList.contains('active')
      ) {
        closeModal();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. DETECÇÃO DE ROLAGEM (EFEITO SOMBRA HEADER)
  // ------------------------------------------------------------------------
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 20) {
          header.style.boxShadow =
            '0 4px 20px rgba(15, 39, 68, 0.08)';
        } else {
          header.style.boxShadow = 'none';
        }
      },
      { passive: true }
    );
  }
});
