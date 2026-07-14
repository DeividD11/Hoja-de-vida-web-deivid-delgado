import { cvData } from "../models/cvData.js";
import {
  renderStats,
  renderProfile,
  renderPersonalData,
  renderEducation,
  renderCourses,
  renderExperience,
  renderSkills,
  renderReferences,
  renderContact,
} from "../views/render.js";

const APP_NAME = "Deivid Aldemar Delgado Naranjo";
const TITLE_FRAMES = ["◐", "◓", "◑", "◒"];

const SECTION_META = {
  inicio: { label: "Inicio", slug: "" },
  resumen: { label: "Resumen", slug: "resumen" },
  perfil: { label: "Perfil profesional", slug: "perfil-profesional" },
  datos: { label: "Datos personales", slug: "datos-personales" },
  formacion: { label: "Formación académica", slug: "formacion-academica" },
  cursos: { label: "Cursos y certificaciones", slug: "cursos-y-certificaciones" },
  experiencia: { label: "Experiencia laboral", slug: "experiencia-laboral" },
  habilidades: { label: "Habilidades", slug: "habilidades" },
  referencias: { label: "Referencias", slug: "referencias" },
  contacto: { label: "Contacto", slug: "contacto" },
};

const SECTION_ORDER = ["inicio", "resumen", "perfil", "datos", "formacion", "cursos", "experiencia", "habilidades", "referencias", "contacto"];

let titleTimer = null;
let faviconTimer = null;
let titleFrameIndex = 0;
let faviconFrameIndex = 0;
let currentSectionId = "inicio";

const reduceMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
const coarsePointerQuery = window.matchMedia?.("(pointer: coarse)") ?? null;
const lowMemoryDevice = typeof navigator !== "undefined" && typeof navigator.deviceMemory === "number" ? navigator.deviceMemory <= 4 : false;
const lowConcurrencyDevice = typeof navigator !== "undefined" && typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency <= 4 : false;
const liteMotionDevice = false;

function getBasePath() {
  const base = new URL("../../", import.meta.url).pathname;
  return base === "/" ? "" : base.replace(/\/$/, "");
}

const BASE_PATH = getBasePath();
const EXPORT_MODE = new URLSearchParams(window.location.search).get("export") === "1";

function normalizePath(pathname = window.location.pathname) {
  const clean = pathname.replace(/\/+$/, "");
  if (!BASE_PATH) return clean || "/";
  if (clean === BASE_PATH) return BASE_PATH;
  if (clean.startsWith(`${BASE_PATH}/`)) return clean;
  return clean || "/";
}

function slugToSectionId(slug) {
  if (!slug || slug === "/") return "inicio";
  const entry = Object.entries(SECTION_META).find(([, meta]) => meta.slug === slug.replace(/^\/+|\/+$/g, ""));
  return entry ? entry[0] : "inicio";
}

function getRouteForSection(sectionId) {
  const meta = SECTION_META[sectionId] ?? SECTION_META.inicio;
  if (!meta.slug) return BASE_PATH || "/";
  return `${BASE_PATH}/${meta.slug}/`;
}

function getSectionLabel(sectionId) {
  return SECTION_META[sectionId]?.label ?? SECTION_META.inicio.label;
}

function getSectionElement(sectionId) {
  if (sectionId === "inicio") return document.getElementById("inicio");
  return document.getElementById(sectionId);
}

function getScrollTarget(sectionId) {
  const el = getSectionElement(sectionId);
  return el ?? document.getElementById("contenido");
}

function getScrollOffset() {
  const topbar = document.querySelector(".topbar");
  const padding = 20;
  const topbarHeight = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
  return topbarHeight + padding;
}

function scrollToTarget(target, behavior = "smooth") {
  if (!target) return;

  const safeBehavior = reduceMotionQuery?.matches ? "auto" : behavior;
  const measureTop = () => Math.max(0, window.scrollY + target.getBoundingClientRect().top - getScrollOffset());
  const align = (scrollBehavior = safeBehavior) => {
    window.scrollTo({ top: measureTop(), behavior: scrollBehavior });
  };

  const settleAndAlign = (frameCount = 0, lastTop = null, stableCount = 0) => {
    const currentTop = measureTop();
    const delta = lastTop === null ? Infinity : Math.abs(currentTop - lastTop);

    if (delta < 1) {
      stableCount += 1;
    } else {
      stableCount = 0;
    }

    align(frameCount === 0 ? safeBehavior : "auto");

    if (safeBehavior === "auto") return;
    if (stableCount >= 2 || frameCount >= 8) return;

    window.requestAnimationFrame(() => settleAndAlign(frameCount + 1, currentTop, stableCount));
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => settleAndAlign());
  });
}

function updateNavState(sectionId) {
  const links = Array.from(document.querySelectorAll(".nav-links a[data-route]"));
  links.forEach((link) => {
    const active = link.dataset.route === sectionId;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function stopTitleAnimation() {
  if (titleTimer) window.clearInterval(titleTimer);
  titleTimer = null;
  titleFrameIndex = 0;
}

function stopFaviconAnimation() {
  if (faviconTimer) window.clearInterval(faviconTimer);
  faviconTimer = null;
  faviconFrameIndex = 0;
}

function createFaviconData(sectionId, frameIndex = 0) {
  const safeFrame = Number.isFinite(frameIndex) ? frameIndex % 4 : 0;
  const frame = sectionId === "inicio" ? safeFrame : (safeFrame + 1) % 4;
  return `${BASE_PATH}/assets/favicon-${frame}.png`;
}

function updateFavicon(sectionId) {
  const link = document.getElementById("appFavicon");
  if (!link) return;
  link.href = `${createFaviconData(sectionId, faviconFrameIndex)}?v=2`;
  link.setAttribute("type", "image/png");
  link.setAttribute("sizes", "32x32");
}

function setTitle(sectionId, animated = true) {
  const label = getSectionLabel(sectionId);
  const shouldAnimate = animated && !reduceMotionQuery?.matches && !document.hidden;

  if (!shouldAnimate) {
    document.title = `${label} · ${APP_NAME}`;
    stopTitleAnimation();
    return;
  }

  stopTitleAnimation();
  document.title = `${label} · ${APP_NAME} ${TITLE_FRAMES[0]}`;
  titleTimer = window.setInterval(() => {
    if (document.hidden) return;
    titleFrameIndex = (titleFrameIndex + 1) % TITLE_FRAMES.length;
    document.title = `${label} · ${APP_NAME} ${TITLE_FRAMES[titleFrameIndex]}`;
  }, 900);
}

function setRouteState(sectionId, { push = false, animate = true } = {}) {
  const safeSection = SECTION_META[sectionId] ? sectionId : "inicio";
  currentSectionId = safeSection;

  updateNavState(safeSection);
  setTitle(safeSection, animate);
  updateFavicon(safeSection);

  const route = getRouteForSection(safeSection);
  if (push) {
    const url = new URL(route, window.location.origin);
    window.history.pushState({ sectionId: safeSection }, "", url.pathname);
  } else {
    const url = new URL(route, window.location.origin);
    window.history.replaceState({ sectionId: safeSection }, "", url.pathname);
  }
}

function parseInitialRoute() {
  const persisted = window.sessionStorage.getItem("gh-pages-route");
  if (persisted) {
    window.sessionStorage.removeItem("gh-pages-route");
    return slugToSectionId(persisted);
  }

  const normalized = normalizePath();
  if (normalized === "/" || normalized === BASE_PATH || normalized === `${BASE_PATH}/`) return "inicio";
  const relative = normalized.startsWith(`${BASE_PATH}/`) ? normalized.slice(BASE_PATH.length + 1) : normalized.replace(/^\//, "");
  return slugToSectionId(relative);
}

function setupRouting() {
  const links = Array.from(document.querySelectorAll(".nav-links a[data-route], [data-route='contacto']"));
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const sectionId = link.dataset.route;
      const target = getScrollTarget(sectionId);
      if (!sectionId || !target) return;
      event.preventDefault();
      setRouteState(sectionId, { push: true, animate: true });
      if (document.fonts?.ready) {
        document.fonts.ready.finally(() => scrollToTarget(target, "smooth"));
      } else {
        scrollToTarget(target, "smooth");
      }
    });
  });

  window.addEventListener("popstate", () => {
    const sectionId = parseInitialRoute();
    const target = getScrollTarget(sectionId);
    setRouteState(sectionId, { push: false, animate: true });
    if (target) {
      if (document.fonts?.ready) {
        document.fonts.ready.finally(() => scrollToTarget(target, "auto"));
      } else {
        scrollToTarget(target, "auto");
      }
    }
  });

  const observedSections = Array.from(document.querySelectorAll("header.hero, main > section[id]"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const sectionId = visible.target.id || "inicio";
        if (!SECTION_META[sectionId] || sectionId === currentSectionId) return;
        setRouteState(sectionId, { push: false, animate: true });
      },
      {
        threshold: [0.25, 0.55],
        rootMargin: "-18% 0px -48% 0px",
      }
    );

    observedSections.forEach((section) => observer.observe(section));
  } else {
    const fallback = () => {
      const scrollY = window.scrollY;
      let activeId = "inicio";
      for (const sectionId of SECTION_ORDER) {
        const el = getSectionElement(sectionId);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY - 130;
        if (scrollY >= top) activeId = sectionId;
      }
      if (activeId !== currentSectionId) setRouteState(activeId, { push: false, animate: true });
    };
    window.addEventListener("scroll", fallback, { passive: true });
  }
}

function setupTitleAndFaviconAnimation() {
  const isAnimationDisabled = Boolean(reduceMotionQuery?.matches);

  if (isAnimationDisabled) {
    stopTitleAnimation();
    stopFaviconAnimation();
    document.title = `${getSectionLabel(currentSectionId)} · ${APP_NAME}`;
    updateFavicon(currentSectionId);
    return;
  }

  stopTitleAnimation();
  setTitle(currentSectionId, true);
  stopFaviconAnimation();
  faviconTimer = window.setInterval(() => {
    if (document.hidden) return;
    faviconFrameIndex = (faviconFrameIndex + 1) % 4;
    updateFavicon(currentSectionId);
  }, 900);
}

function setupRevealAnimations() {
  const targets = Array.from(document.querySelectorAll(
    ".hero-copy, .hero-panel, .stats-card, main > section, .content-card, .card, .panel-item, .definition-item, .timeline-item, .skill-chip"
  ));

  const isLite = Boolean(reduceMotionQuery?.matches);

  targets.forEach((element, index) => {
    element.setAttribute("data-reveal", "");
    if (isLite) {
      element.style.setProperty("--reveal-delay", "0ms");
      return;
    }
    element.style.setProperty("--reveal-delay", `${Math.min(index * 24, 180)}ms`);
  });

  if (!("IntersectionObserver" in window) || isLite) {
    targets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((element) => observer.observe(element));
}

function setupBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 420);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotionQuery?.matches ? "auto" : "smooth" });
  });
}

function setHeaderInfo() {
  const name = document.getElementById("cvName");
  const headline = document.getElementById("cvHeadline");
  const summary = document.getElementById("cvSummary");
  const location = document.getElementById("cvLocation");
  const email = document.getElementById("cvEmail");
  const phone = document.getElementById("cvPhone");

  name.textContent = cvData.identity.fullName;
  headline.textContent = cvData.identity.headline;
  summary.textContent = cvData.identity.shortSummary;
  location.textContent = cvData.identity.location;
  email.textContent = cvData.identity.email;
  phone.textContent = cvData.identity.phone;
}

function setMotionMode(isDisabled) {
  document.documentElement.classList.toggle("no-motion", isDisabled);
  document.body.classList.toggle("no-motion", isDisabled);
}

function setupPrintMotionControl() {
  const handleBeforePrint = () => setMotionMode(true);
  const handleAfterPrint = () => setMotionMode(false);

  window.addEventListener("beforeprint", handleBeforePrint);
  window.addEventListener("afterprint", handleAfterPrint);

  if (window.matchMedia) {
    const media = window.matchMedia("print");
    const sync = (event) => setMotionMode(event.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
    } else if (typeof media.addListener === "function") {
      media.addListener(sync);
    }
    setMotionMode(media.matches);
  }
}

function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|FB_IAB|FB4A|Messenger|Instagram/i.test(ua);
}

function getExportModeUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("export", "1");
  return url.toString();
}

function buildExportDocument() {
  const clone = document.documentElement.cloneNode(true);

  clone.querySelectorAll("script").forEach((script) => script.remove());
  clone.querySelectorAll("[data-export-hidden='true']").forEach((node) => node.remove());

  clone.querySelectorAll('link[href]').forEach((link) => {
    const rel = (link.getAttribute("rel") || "").toLowerCase();
    if (rel.includes("stylesheet") || rel.includes("icon")) {
      const absoluteHref = new URL(link.getAttribute("href"), window.location.href).href;
      link.setAttribute("href", absoluteHref);
    }
  });

  const htmlClass = clone.getAttribute("class") || "";
  const mergedClasses = new Set(htmlClass.split(/\s+/).filter(Boolean));
  mergedClasses.add("export-preview");
  clone.setAttribute("class", Array.from(mergedClasses).join(" "));

  const title = document.title || APP_NAME;
  const body = clone.querySelector("body");
  if (body) {
    body.setAttribute("data-export-mode", "true");
  }

  return `<!doctype html>\n${clone.outerHTML}`.replace(
    /<title>.*?<\/title>/i,
    `<title>${title}</title>`
  );
}

function openExportPreview() {
  const exportHtml = buildExportDocument();
  const blob = new Blob([exportHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const features = "noopener,noreferrer";
  const preview = window.open(url, "_blank", features);

  if (preview) {
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  }

  URL.revokeObjectURL(url);
  return false;
}

function downloadExportFile() {
  const exportHtml = buildExportDocument();
  const blob = new Blob([exportHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const safeTitle = (document.title || "hoja-de-vida").replace(/[^\w.-]+/g, "-");
  const fileName = `${safeTitle}.html`;
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function handleExportAction() {
  const canNativePrint = typeof window.print === "function" && !isInAppBrowser();

  if (canNativePrint) {
    setMotionMode(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.print();
      });
    });
    return;
  }

  if (isInAppBrowser()) {
    window.location.assign(getExportModeUrl());
    return;
  }

  const opened = openExportPreview();
  if (opened) return;

  if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "")) {
    try {
      await navigator.share({
        title: document.title || APP_NAME,
        text: "Abre esta hoja de vida en el navegador para imprimir o exportar.",
        url: window.location.href,
      });
      return;
    } catch (error) {
      // Continue to file download fallback.
    }
  }

  window.location.assign(getExportModeUrl());
}

function setupExportMode() {
  if (!EXPORT_MODE) return;

  document.documentElement.classList.add("export-preview");
  document.body.dataset.exportMode = "true";
  setMotionMode(true);
}

function buildApp() {
  setupBackToTop();
  setHeaderInfo();
  setupExportMode();

  renderStats(document.getElementById("resumen"), cvData);
  renderProfile(document.getElementById("perfil"), cvData);
  renderPersonalData(document.getElementById("datos"), cvData);
  renderEducation(document.getElementById("formacion"), cvData);
  renderCourses(document.getElementById("cursos"), cvData);
  renderExperience(document.getElementById("experiencia"), cvData);
  renderSkills(document.getElementById("habilidades"), cvData);
  renderReferences(document.getElementById("referencias"), cvData);

  const form = renderContact(document.getElementById("contacto"), cvData);

  const initialSection = parseInitialRoute();
  setRouteState(initialSection, { push: false, animate: true });

  setupRouting();
  setupPrintMotionControl();
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  setupRevealAnimations();
  setupTitleAndFaviconAnimation();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTitleAnimation();
      stopFaviconAnimation();
      return;
    }
    setupTitleAndFaviconAnimation();
  });

  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      void handleExportAction();
    });
  }

  if (form) {
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("reset", () => setStatus("", ""));

    const sendBtn = document.getElementById("contactSendBtn");
    const resetBtn = document.getElementById("contactResetBtn");

    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        processContactForm(form);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        setStatus("", "");
        const firstInput = form.querySelector("input, textarea");
        firstInput?.focus();
      });
    }
  }

  if (EXPORT_MODE && !isInAppBrowser() && typeof window.print === "function") {
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.finally(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.print();
        });
      });
    });
  }
}

function setStatus(message, type) {
  const status = document.getElementById("formStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `form-status ${type || ""}${message ? " is-active" : ""}`.trim();
  if (!message) {
    status.removeAttribute("role");
    return;
  }
  status.setAttribute("role", type === "error" ? "alert" : "status");
}

function validateForm(formData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (name.length < 2) return "Escribe un nombre válido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Escribe un correo electrónico válido.";
  if (message.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
  return "";
}

function buildWhatsAppMessage({ name, email, message }) {
  const lines = [
    "Hola, cordial saludo.",
    "",
    "Me comunico a través de la hoja de vida web y agradezco su atención.",
    "",
    "Datos de contacto:",
    `- Nombre: ${name}`,
    `- Correo: ${email}`,
    "",
    "Mensaje:",
    message,
    "",
    "Quedo atento a su respuesta.",
  ];

  return lines.join("\n");
}

function openWhatsAppChat(message) {
  const phoneNumber = "573229266368";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}

function processContactForm(form) {
  const formData = new FormData(form);

  const validationError = validateForm(formData);
  if (validationError) {
    setStatus(validationError, "error");
    return false;
  }

  const payload = {
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim(),
    message: String(formData.get("message")).trim(),
  };

  setStatus("Preparando tu mensaje en WhatsApp...", "");
  const whatsappMessage = buildWhatsAppMessage(payload);
  openWhatsAppChat(whatsappMessage);
  form.reset();
  setStatus("Mensaje preparado correctamente en WhatsApp.", "success");
  return true;
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;

  try {
    processContactForm(form);
  } catch (error) {
    console.error("WhatsApp submit error:", error);
    setStatus("No fue posible abrir WhatsApp. Verifica tu conexión o intenta de nuevo.", "error");
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", buildApp);
}
