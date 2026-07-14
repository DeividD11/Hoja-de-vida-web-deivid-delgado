const createEl = (tag, { className = "", text = "", html = "", attrs = {} } = {}) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  if (html) el.innerHTML = html;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
};

const section = (title, subtitle, badge) => {
  const head = createEl("div", { className: "section-head" });
  const left = createEl("div");
  left.append(
    createEl("h2", { text: title }),
    createEl("p", { text: subtitle })
  );
  head.append(left);
  if (badge) head.append(createEl("span", { className: "badge", text: badge }));
  return head;
};

export function renderStats(container, cv) {
  const cards = [
    { label: "Perfil", value: "Técnico en software" },
    { label: "Formación", value: `${cv.education.length} niveles` },
    { label: "Cursos y seminarios", value: `${cv.courses.length} registros` },
    { label: "Experiencia", value: `${cv.experience.length} cargos` },
  ];

  container.innerHTML = "";
  cards.forEach(({ label, value }) => {
    const card = createEl("article", { className: "stats-card" });
    card.append(
      createEl("span", { text: label }),
      createEl("strong", { text: value })
    );
    container.append(card);
  });
}

export function renderProfile(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Perfil profesional",
      "Resumen redactado exclusivamente a partir del contenido del PDF.",
      "Perfil"
    )
  );

  const grid = createEl("div", { className: "grid-2" });

  const left = createEl("div", { className: "card" });
  left.append(
    createEl("h3", { text: "Síntesis profesional" }),
    createEl("p", { text: cv.identity.shortSummary })
  );

  const right = createEl("div", { className: "card" });
  right.append(
    createEl("h3", { text: "Fortalezas destacadas" }),
    createEl("ul", {
      html: cv.profile
        .slice(4)
        .map((item) => `<li>${item}</li>`)
        .join(""),
    })
  );

  grid.append(left, right);
  card.append(grid);
  container.append(card);
}

export function renderPersonalData(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Datos personales",
      "La información se presenta de forma prudente y con el formato más legible posible sin alterar el contenido original.",
      "Identificación"
    )
  );

  const list = createEl("dl", { className: "definition-list" });
  cv.personalData.forEach(({ label, value }) => {
    const item = createEl("div", { className: "definition-item" });
    item.append(
      createEl("dt", { text: label }),
      createEl("dd", { text: value })
    );
    list.append(item);
  });
  card.append(list);
  container.append(card);
}

function renderTimelineCard(item, extraMeta = []) {
  const card = createEl("article", { className: "timeline-item" });
  const meta = createEl("div", { className: "timeline-meta" });
  extraMeta.forEach((metaItem) => meta.append(createEl("span", { className: "pill", text: metaItem })));
  card.append(
    meta,
    createEl("h3", { text: item.title || item.detail || item.role || item.company }),
    createEl("p", { text: item.institution ? `${item.institution}. ${item.detail || ""}`.trim() : item.detail || "" })
  );
  return card;
}

export function renderEducation(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Formación académica",
      "Educación formal, idioma extranjero y bases de aprendizaje reportadas en el PDF.",
      "Academia"
    )
  );

  const grid = createEl("div", { className: "grid-2" });
  const educationList = createEl("div", { className: "timeline" });
  cv.education.forEach((item) => educationList.append(renderTimelineCard({
    title: item.title,
    institution: item.institution,
    detail: `${item.detail} · ${item.period}`,
  }, [item.period])));

  const languageCard = createEl("div", { className: "card" });
  languageCard.append(
    createEl("h3", { text: "Idioma extranjero" }),
    createEl("p", { text: "Academia de idiomas - Smart" }),
    createEl("p", { text: "Inglés general · Abril 2022 - Actualmente" }),
    createEl("p", { className: "muted", text: "Este dato se presenta tal como aparece en el documento." })
  );

  grid.append(educationList, languageCard);
  card.append(grid);
  container.append(card);
}

export function renderCourses(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Cursos, seminarios y certificaciones",
      "Se agrupan seminarios, talleres, capacitaciones y reconocimientos para facilitar la lectura.",
      "Complementaria"
    )
  );

  const grid = createEl("div", { className: "grid-2" });
  const left = createEl("div", { className: "timeline" });
  const right = createEl("div", { className: "timeline" });

  const splitPoint = Math.ceil(cv.courses.length / 2);
  cv.courses.slice(0, splitPoint).forEach((item) => {
    left.append(renderTimelineCard(item, [item.type]));
  });
  cv.courses.slice(splitPoint).forEach((item) => {
    right.append(renderTimelineCard(item, [item.type]));
  });

  card.append(grid);
  grid.append(left, right);

  if (cv.recognitions?.length) {
    const recTitle = createEl("h3", { text: "Reconocimientos" });
    const recGrid = createEl("div", { className: "grid-2", attrs: { style: "margin-top:16px" } });
    cv.recognitions.forEach((item) => {
      const r = createEl("div", { className: "card" });
      r.append(
        createEl("h3", { text: item.title }),
        createEl("p", { text: item.institution }),
        createEl("p", { text: item.period })
      );
      recGrid.append(r);
    });
    card.append(recTitle, recGrid);
  }

  container.append(card);
}

export function renderExperience(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Experiencia laboral",
      "Experiencia independiente y laboral presentada en formato de línea de tiempo.",
      "Trayectoria"
    )
  );

  const timeline = createEl("div", { className: "timeline" });
  cv.experience.forEach((item) => {
    const exp = createEl("article", { className: "timeline-item" });
    const meta = createEl("div", { className: "timeline-meta" });
    [item.company, item.role, item.period].forEach((m) => meta.append(createEl("span", { className: "pill", text: m })));

    const list = createEl("ul");
    item.responsibilities.forEach((resp) => list.append(createEl("li", { text: resp })));

    exp.append(
      meta,
      createEl("h3", { text: item.manager }),
      createEl("p", { text: `Cargo: ${item.role}` }),
      createEl("p", { text: `Teléfono: ${item.phone}` }),
      list
    );
    timeline.append(exp);
  });
  card.append(timeline);
  container.append(card);
}

export function renderSkills(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Competencias y habilidades técnicas",
      "Conjunto de herramientas, sistemas y fortalezas declaradas en el PDF.",
      "Skills"
    )
  );

  const grid = createEl("div", { className: "grid-2" });

  const technical = createEl("div", { className: "card" });
  technical.append(createEl("h3", { text: "Habilidades técnicas" }));
  const technicalWrap = createEl("div", { className: "skill-list" });
  cv.skills.technical.forEach((skill) => technicalWrap.append(createEl("span", { className: "skill-chip", text: skill })));
  technical.append(technicalWrap);

  const soft = createEl("div", { className: "card" });
  soft.append(createEl("h3", { text: "Fortalezas personales" }));
  const softWrap = createEl("div", { className: "skill-list" });
  cv.skills.strengths.forEach((skill) => softWrap.append(createEl("span", { className: "skill-chip", text: skill })));
  soft.append(softWrap);

  grid.append(technical, soft);
  card.append(grid);
  container.append(card);
}

export function renderReferences(container, cv) {
  const card = createEl("article", { className: "content-card" });
  card.append(
    section(
      "Referencias o contactos",
      "Las referencias se muestran únicamente con la información visible en el PDF, sin inferir datos faltantes.",
      "Contactos"
    )
  );

  const grid = createEl("div", { className: "grid-3" });
  cv.references.forEach((ref) => {
    const refCard = createEl("div", { className: "card" });
    refCard.append(
      createEl("h3", { text: ref.name }),
      createEl("p", { text: ref.role }),
      createEl("p", { text: ref.organization }),
      createEl("p", { text: ref.phone })
    );
    grid.append(refCard);
  });
  card.append(grid);
  container.append(card);
}


export function renderContact(container, cv) {
  const card = createEl("article", { className: "content-card contact-card" });
  card.append(
    section(
      "Contacto por WhatsApp",
      "Completa tus datos y se abrirá WhatsApp con un mensaje formal, claro y listo para enviar al número configurado.",
      "WhatsApp"
    )
  );

  const form = createEl("form", { className: "form", attrs: { novalidate: "novalidate" } });

  form.innerHTML = `
    <div class="form-grid">
      <div class="field">
        <label for="contactName">Nombre</label>
        <input id="contactName" name="name" type="text" autocomplete="name" placeholder="Tu nombre completo" minlength="2" required />
      </div>
      <div class="field">
        <label for="contactEmail">Correo electrónico</label>
        <input id="contactEmail" name="email" type="email" autocomplete="email" placeholder="tu@correo.com" required />
      </div>
    </div>
    <div class="field">
      <label for="contactMessage">Mensaje</label>
      <textarea id="contactMessage" name="message" minlength="10" maxlength="1000" placeholder="Escribe aquí tu solicitud, propuesta o consulta..." required></textarea>
    </div>
    <div class="hero-actions">
      <button class="btn btn-primary" type="button" id="contactSendBtn">Enviar por WhatsApp</button>
      <button class="btn btn-secondary" type="button" id="contactResetBtn">Limpiar</button>
    </div>
    <p id="formStatus" class="form-status" aria-live="polite"></p>
  `;

  card.append(form);
  container.append(card);
  return form;
}

