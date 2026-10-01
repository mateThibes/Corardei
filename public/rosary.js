// ═══════════════════════════════════════════════════════════════════════════
// ROSARIO INTERACTIVO — Modelo FSM Canónico
// ═══════════════════════════════════════════════════════════════════════════
// Cada paso ("step") del rosario se modela como un nodo con tipo, id de
// cuenta visual, oración y metadatos. La visualización SVG se genera a
// partir del mismo arreglo de pasos, garantizando sincronización perfecta.
// ═══════════════════════════════════════════════════════════════════════════

const PRAYERS = {
  signumCrucis: "Por la señal de la Santa Cruz, de nuestros enemigos líbranos, Señor Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.",
  credo: "Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre Todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.",
  padreNuestro: "Padre nuestro que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.",
  aveMaria: "Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
  gloria: "Gloria al Padre y al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  fatima: "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.",
  salve: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh, clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén."
};

const MYSTERIES_BY_TYPE = [
  {
    name: "Gozosos",
    days: [1, 6], // Lunes y Sábados
    mysteries: [
      "La Encarnación del Hijo de Dios",
      "La Visitación de Nuestra Señora a su prima Santa Isabel",
      "El Nacimiento del Hijo de Dios",
      "La Presentación de Jesús en el Templo",
      "El Niño Jesús perdido y hallado en el Templo"
    ]
  },
  {
    name: "Dolorosos",
    days: [2, 5], // Martes y Viernes
    mysteries: [
      "La Oración en el Huerto",
      "La Flagelación de Nuestro Señor",
      "La Coronación de Espinas",
      "Jesús con la Cruz a Cuestas",
      "La Crucifixión y Muerte de Jesús"
    ]
  },
  {
    name: "Gloriosos",
    days: [0, 3], // Domingo y Miércoles
    mysteries: [
      "La Resurrección del Señor",
      "La Ascensión del Señor al Cielo",
      "La Venida del Espíritu Santo",
      "La Asunción de la Virgen María",
      "La Coronación de la Virgen María"
    ]
  },
  {
    name: "Luminosos",
    days: [4], // Jueves
    mysteries: [
      "El Bautismo en el Jordán",
      "La Autorrevelación en las Bodas de Caná",
      "El Anuncio del Reino de Dios",
      "La Transfiguración",
      "La Institución de la Eucaristía"
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────
// Virtudes para las 3 Avemarías iniciales
// ─────────────────────────────────────────────────────────────────────────
const INITIAL_AVE_VIRTUES = ["la Fe", "la Esperanza", "la Caridad"];

// ═══════════════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

class RosaryApp {
  constructor() {
    this.currentStepIndex = 0;
    /** @type {RosaryStep[]} */
    this.steps = [];
    this.selectedMysterySet = this.getMysterySetByDay(new Date().getDay());

    // ── Nodos del DOM ──
    this.titleEl = document.getElementById("prayerTitle");
    this.instructionEl = document.getElementById("prayerInstruction");
    this.textEl = document.getElementById("prayerText");
    this.badgeEl = document.getElementById("mysteryBadge");
    this.counterEl = document.getElementById("stepCounter");
    this.progressEl = document.getElementById("progressBar");
    this.prevBtn = document.getElementById("btnPrev");
    this.nextBtn = document.getElementById("btnNext");
    this.resetBtn = document.getElementById("btnReset");
    this.daySelect = document.getElementById("daySelect");
    this.svgEl = document.getElementById("rosarySvg");

    // Inicializar solo si estamos en la página que tiene la guía interactiva
    if (this.titleEl) {
      this.initDaySelector();
      this.buildSteps();
      if (this.svgEl) this.renderRosaryMap();
      this.attachEvents();
      this.render();
    }
  }

  getMysterySetByDay(dayIndex) {
    return MYSTERIES_BY_TYPE.find(m => m.days.includes(dayIndex)) || MYSTERIES_BY_TYPE[0];
  }

  initDaySelector() {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const currentDay = new Date().getDay();

    dayNames.forEach((name, idx) => {
      const opt = document.createElement("option");
      opt.value = idx.toString();
      opt.textContent = `${name} (${this.getMysterySetByDay(idx).name})`;
      if (idx === currentDay) opt.selected = true;
      this.daySelect.appendChild(opt);
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // MODELO DE DATOS: Construir el arreglo canónico de pasos
  // ─────────────────────────────────────────────────────────────────────
  //
  //  Cada nodo tiene:
  //    id            : índice secuencial único
  //    beadId        : clave unívoca para el SVG ("cross", "pendant-lg", etc.)
  //    type          : 'cross' | 'large_bead' | 'small_bead' | 'medal' | 'transition' | 'center_medal'
  //    mysteryNumber : 1–5 si pertenece a una decena, undefined si no
  //    title         : título corto mostrado al usuario
  //    instruction   : instrucción contextual
  //    prayerText    : oración completa
  //    groupLabel    : etiqueta del grupo (Inicio, Misterio N, Cierre)
  //
  // ─────────────────────────────────────────────────────────────────────

  buildSteps() {
    this.steps = [];
    let id = 0;

    // ═══════════════════════════════════
    // FASE A — Colgante / Inicio (lineal)
    // ═══════════════════════════════════

    // Paso 0 | Cruz: Señal de la Cruz + Credo
    this.steps.push({
      id: id,
      beadId: "cross",
      type: "cross",
      title: "Señal de la Cruz y Credo",
      instruction: "Sostén el crucifijo del rosario",
      prayerText: `${PRAYERS.signumCrucis}\n\n${PRAYERS.credo}`,
      groupLabel: "Inicio"
    });
    id++;

    // Paso 1 | Cuenta grande: Padrenuestro
    this.steps.push({
      id: id,
      beadId: "pendant-lg",
      type: "large_bead",
      title: "Padrenuestro",
      instruction: "Primera cuenta grande",
      prayerText: PRAYERS.padreNuestro,
      groupLabel: "Inicio"
    });
    id++;

    // Pasos 2–4 | Tres cuentas chicas: Avemarías (Fe, Esperanza, Caridad)
    for (let i = 0; i < 3; i++) {
      this.steps.push({
        id: id,
        beadId: `pendant-sm-${i + 1}`,
        type: "small_bead",
        title: `Avemaría (${i + 1}/3)`,
        instruction: `Por ${INITIAL_AVE_VIRTUES[i]}`,
        prayerText: PRAYERS.aveMaria,
        groupLabel: "Inicio"
      });
      id++;
    }

    // Paso 5 | Medalla/Transición: Gloria + Jaculatoria de Fátima
    this.steps.push({
      id: id,
      beadId: "pendant-medal",
      type: "medal",
      title: "Gloria y Jaculatoria de Fátima",
      instruction: "En la medalla, antes de iniciar los misterios",
      prayerText: `${PRAYERS.gloria}\n\n${PRAYERS.fatima}`,
      groupLabel: "Inicio"
    });
    id++;

    // ═══════════════════════════════════
    // FASE B — Las 5 Decenas (anillo)
    // ═══════════════════════════════════

    for (let m = 0; m < 5; m++) {
      const mysteryNum = m + 1;
      const mysteryTitle = this.selectedMysterySet.mysteries[m];
      const decadeLabel = `${mysteryNum}° Misterio`;

      // Sub-paso 1: Cuenta grande — Anuncio del misterio + Padrenuestro
      this.steps.push({
        id: id,
        beadId: `decade-${mysteryNum}-lg`,
        type: "large_bead",
        mysteryNumber: mysteryNum,
        title: `${mysteryNum}° Misterio: ${mysteryTitle}`,
        instruction: `Medita este misterio y reza un Padrenuestro`,
        prayerText: PRAYERS.padreNuestro,
        groupLabel: decadeLabel
      });
      id++;

      // Sub-pasos 2–11: 10 cuentas chicas — Avemarías
      for (let bead = 1; bead <= 10; bead++) {
        this.steps.push({
          id: id,
          beadId: `decade-${mysteryNum}-sm-${bead}`,
          type: "small_bead",
          mysteryNumber: mysteryNum,
          title: `Avemaría (${bead}/10)`,
          instruction: `${decadeLabel} — Sigue meditando el misterio`,
          prayerText: PRAYERS.aveMaria,
          groupLabel: decadeLabel
        });
        id++;
      }

      // Sub-paso 12: Transición — Gloria + Jaculatoria de Fátima
      this.steps.push({
        id: id,
        beadId: `decade-${mysteryNum}-transition`,
        type: "transition",
        mysteryNumber: mysteryNum,
        title: "Gloria y Jaculatoria de Fátima",
        instruction: `Cierre de la ${decadeLabel.toLowerCase()}`,
        prayerText: `${PRAYERS.gloria}\n\n${PRAYERS.fatima}`,
        groupLabel: decadeLabel
      });
      id++;
    }

    // ═══════════════════════════════════
    // FASE C — Cierre
    // ═══════════════════════════════════

    this.steps.push({
      id: id,
      beadId: "center-medal",
      type: "center_medal",
      title: "Salve y Oraciones Finales",
      instruction: "Sostén la medalla central",
      prayerText: `${PRAYERS.salve}\n\n${PRAYERS.signumCrucis}`,
      groupLabel: "Cierre"
    });
    id++;

    // ── Construir lookup beadId → stepIndex para clicks SVG ──
    this._beadToStep = {};
    this.steps.forEach((step, idx) => {
      this._beadToStep[step.beadId] = idx;
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // EVENTOS
  // ─────────────────────────────────────────────────────────────────────

  attachEvents() {
    this.nextBtn.addEventListener("click", () => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
        this.render();
      }
    });

    this.prevBtn.addEventListener("click", () => {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--;
        this.render();
      }
    });

    this.resetBtn.addEventListener("click", () => {
      this.currentStepIndex = 0;
      this.render();
    });

    this.daySelect.addEventListener("change", (e) => {
      this.selectedMysterySet = this.getMysterySetByDay(parseInt(e.target.value, 10));
      this.currentStepIndex = 0;
      this.buildSteps();
      if (this.svgEl) this.renderRosaryMap();
      this.render();
    });

    // Atajos de teclado
    document.addEventListener("keydown", (e) => {
      // Solo si la sección del rosario es visible
      if (!this.titleEl) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (this.currentStepIndex < this.steps.length - 1) {
          this.currentStepIndex++;
          this.render();
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (this.currentStepIndex > 0) {
          this.currentStepIndex--;
          this.render();
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER — Actualizar la UI de oración y controles
  // ─────────────────────────────────────────────────────────────────────

  render() {
    const current = this.steps[this.currentStepIndex];
    const total = this.steps.length;

    // Texto de oración
    this.titleEl.textContent = current.title;
    this.instructionEl.textContent = current.instruction;
    this.textEl.textContent = current.prayerText;

    // Badge y contador
    this.badgeEl.textContent = `${this.selectedMysterySet.name} · ${current.groupLabel}`;
    this.counterEl.textContent = `Paso ${this.currentStepIndex + 1} de ${total}`;

    // Barra de progreso
    const progressPercent = ((this.currentStepIndex + 1) / total) * 100;
    this.progressEl.style.width = `${progressPercent}%`;

    // Estado de botones
    this.prevBtn.disabled = this.currentStepIndex === 0;
    this.nextBtn.disabled = this.currentStepIndex === total - 1;
    this.nextBtn.textContent = this.currentStepIndex === total - 1 ? "✓ Completado" : "Siguiente →";

    // Sincronizar SVG
    if (this.svgEl) {
      this.updateActiveBeadUI();
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // SVG — Dibujar el mapa visual del rosario
  // ─────────────────────────────────────────────────────────────────────
  //
  //  Geometría:
  //    - Colgante vertical: cruz → cuenta grande → 3 chicas → medalla
  //    - Anillo elíptico: 5 × (1 grande + 10 chicas + 1 transición marcada)
  //    - Medalla central en el punto de unión
  //
  //  CLAVE DE LA CORRECCIÓN:
  //    Cada elemento SVG recibe `data-bead-id` que coincide exactamente con
  //    el `beadId` del paso correspondiente en this.steps. Así, sin importar
  //    cuántos "pasos lógicos" haya (ej: la cruz tiene Señal+Credo en UN
  //    solo paso), la cuenta visual apunta al paso correcto.
  //
  // ─────────────────────────────────────────────────────────────────────

  renderRosaryMap() {
    this.svgEl.innerHTML = "";

    // ── Dimensiones ──
    const W = 400;
    const H = 450;

    // ── Colores para las líneas de conexión ──
    const chainColor = "#c9a94e";
    const chainWidth = 1.5;

    // ══════════════════════════════════
    // PARTE 1: Colgante vertical
    // ══════════════════════════════════

    const pendantBeads = [
      { beadId: "cross",         x: 200, y: 420, type: "cross" },
      { beadId: "pendant-lg",    x: 200, y: 375, type: "large_bead" },
      { beadId: "pendant-sm-1",  x: 200, y: 350, type: "small_bead" },
      { beadId: "pendant-sm-2",  x: 200, y: 330, type: "small_bead" },
      { beadId: "pendant-sm-3",  x: 200, y: 310, type: "small_bead" },
      { beadId: "pendant-medal", x: 200, y: 280, type: "medal" },
    ];

    // Dibujar cadena del colgante
    for (let i = 0; i < pendantBeads.length - 1; i++) {
      this._drawChain(pendantBeads[i].x, pendantBeads[i].y, pendantBeads[i + 1].x, pendantBeads[i + 1].y, chainColor, chainWidth);
    }

    // Dibujar cada cuenta del colgante
    pendantBeads.forEach(b => {
      if (b.type === "cross") {
        this._drawCross(b.x, b.y, b.beadId);
      } else if (b.type === "medal") {
        this._drawMedal(b.x, b.y, b.beadId);
      } else {
        this._drawBead(b.x, b.y, b.type === "large_bead" ? 7 : 5, b.beadId, b.type === "large_bead");
      }
    });

    // ══════════════════════════════════
    // PARTE 2: Anillo elíptico (5 decenas)
    // ══════════════════════════════════

    const centerX = 200;
    const centerY = 145;
    const rx = 145;
    const ry = 115;

    // Calcular todas las posiciones del anillo.
    // Distribución: 5 decenas de (1 grande + 10 chicas) = 55 cuentas visibles
    // + 5 transiciones virtuales (marcadas entre decenas, sin cuenta física
    //   adicional — su click lo absorbemos en la última chica o en el espacio).
    //
    // Para mantener la coherencia visual, las transiciones (Gloria+Fátima)
    // se representan como un pequeño marcador entre decenas.

    const BEADS_PER_DECADE = 11; // 1 grande + 10 chicas
    const TOTAL_RING_POSITIONS = 5 * BEADS_PER_DECADE + 5; // +5 para transiciones
    // = 60 posiciones en el anillo

    // Asignar beadIds y pesos a las cuentas del anillo
    const ringBeads = [];
    for (let m = 0; m < 5; m++) {
      const mysteryNum = m + 1;
      
      // Cuenta grande del misterio (ocupa más espacio)
      ringBeads.push({ beadId: `decade-${mysteryNum}-lg`, type: "large_bead", weight: 1.8 });
      
      // 10 cuentas chicas
      for (let b = 1; b <= 10; b++) {
        ringBeads.push({ beadId: `decade-${mysteryNum}-sm-${b}`, type: "small_bead", weight: 1.0 });
      }
      
      // Transición (diamante)
      ringBeads.push({ beadId: `decade-${mysteryNum}-transition`, type: "transition", weight: 1.2 });
    }

    // Calcular ángulos basados en pesos para distribuir el espacio uniformemente
    const totalWeight = ringBeads.reduce((sum, b) => sum + b.weight, 0);
    
    // Espacio virtual en el fondo (π/2) para la medalla y las conexiones (forma de V)
    const gapWeight = 2.0; 
    const effectiveTotalWeight = totalWeight + gapWeight;

    // Empezamos desde la mitad del gap para que quede centrado simétricamente abajo
    let currentAngleWeight = gapWeight / 2;

    ringBeads.forEach(b => {
      // El ángulo central de esta cuenta
      const angle = (Math.PI / 2) + ((currentAngleWeight + b.weight / 2) / effectiveTotalWeight) * 2 * Math.PI;
      b.x = centerX + rx * Math.cos(angle);
      b.y = centerY + ry * Math.sin(angle);
      currentAngleWeight += b.weight;
    });

    // Dibujar cadenas del anillo (NO cerramos el loop, dejamos el hueco para la medalla)
    for (let i = 0; i < ringBeads.length - 1; i++) {
      const next = i + 1;
      this._drawChain(ringBeads[i].x, ringBeads[i].y, ringBeads[next].x, ringBeads[next].y, chainColor, chainWidth);
    }

    // Conectar el colgante al anillo: desde la medalla del colgante hasta
    // la primera cuenta del anillo (que está justo arriba de la medalla).
    // El cierre del loop (ring[last]→ring[0]) ya conecta el otro lado.
    const firstRing = ringBeads[0];
    const lastRing = ringBeads[ringBeads.length - 1];
    const medalPos = pendantBeads[pendantBeads.length - 1]; // pendant-medal
    this._drawChain(medalPos.x, medalPos.y, firstRing.x, firstRing.y, chainColor, chainWidth);
    this._drawChain(medalPos.x, medalPos.y, lastRing.x, lastRing.y, chainColor, chainWidth);
    // Cadena corta adicional: medalla ↔ último bead (V de unión)
    // Ambas cadenas son cortísimas (~20px) y no cruzan el anillo

    // Dibujar cuentas del anillo
    ringBeads.forEach(b => {
      if (b.type === "transition") {
        this._drawTransitionMarker(b.x, b.y, b.beadId);
      } else {
        this._drawBead(b.x, b.y, b.type === "large_bead" ? 7 : 4.5, b.beadId, b.type === "large_bead");
      }
    });

    // ══════════════════════════════════
    // PARTE 3: Medalla central
    // ══════════════════════════════════
    // Ya la dibujamos como "pendant-medal" en el colgante.
    // El "center-medal" del cierre puede reutilizar visualmente la misma
    // posición que la medalla del colgante, o dibujarla levemente diferente.
    // Para el modelo lógico, el paso "center-medal" de cierre corresponde
    // al mismo punto visual que "pendant-medal". Lo mapeamos así:
    this._drawCenterMedal(medalPos.x, medalPos.y - 2, "center-medal");
  }

  // ── Primitivas de dibujo SVG ──

  _drawChain(x1, y1, x2, y2, color, width) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", width);
    line.setAttribute("stroke-opacity", "0.5");
    this.svgEl.appendChild(line);
  }

  _drawBead(cx, cy, r, beadId, isLarge) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.classList.add("rosary-bead");
    if (isLarge) circle.classList.add("rosary-bead--large");
    circle.dataset.beadId = beadId;
    circle.addEventListener("click", (e) => {
      this._onBeadClick(beadId);
    });
    this.svgEl.appendChild(circle);
  }

  _drawCross(cx, cy, beadId) {
    // Cruz compacta con path
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("rosary-bead", "rosary-bead--cross");
    g.dataset.beadId = beadId;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const hw = 4; // half-width del brazo
    const d = `
      M ${cx - hw} ${cy - 15}
      h ${hw * 2} v 8 h 8 v ${hw * 2} h -8 v 14
      h -${hw * 2} v -14 h -8 v -${hw * 2} h 8 z
    `;
    path.setAttribute("d", d);
    path.classList.add("rosary-cross-path");
    g.appendChild(path);

    g.addEventListener("click", (e) => {
      e.currentTarget.blur();
      this._onBeadClick(beadId);
    });
    this.svgEl.appendChild(g);
  }

  _drawMedal(cx, cy, beadId) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("rosary-bead", "rosary-bead--medal");
    g.dataset.beadId = beadId;

    const outer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outer.setAttribute("cx", cx);
    outer.setAttribute("cy", cy);
    outer.setAttribute("r", 8);
    outer.classList.add("rosary-medal-outer");
    g.appendChild(outer);

    const inner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    inner.setAttribute("cx", cx);
    inner.setAttribute("cy", cy);
    inner.setAttribute("r", 4);
    inner.classList.add("rosary-medal-inner");
    g.appendChild(inner);

    g.addEventListener("click", (e) => {
      this._onBeadClick(beadId);
    });
    this.svgEl.appendChild(g);
  }

  _drawTransitionMarker(cx, cy, beadId) {
    // Pequeño diamante/rombo para marcar la transición Gloria+Fátima entre decenas
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("rosary-bead", "rosary-bead--transition");
    g.dataset.beadId = beadId;

    const size = 4;
    const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    diamond.setAttribute("points", `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`);
    diamond.classList.add("rosary-transition-diamond");
    g.appendChild(diamond);

    g.addEventListener("click", (e) => {
      this._onBeadClick(beadId);
    });
    this.svgEl.appendChild(g);
  }

  _drawCenterMedal(cx, cy, beadId) {
    // La medalla central de cierre. Visualmente comparte posición con la
    // medalla del colgante pero es un elemento separado para el step final.
    // Se oculta visualmente y solo se activa en el último paso.
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 10);
    circle.classList.add("rosary-bead", "rosary-bead--center-medal");
    circle.dataset.beadId = beadId;
    circle.addEventListener("click", (e) => {
      e.currentTarget.blur();
      this._onBeadClick(beadId);
    });
    this.svgEl.appendChild(circle);
  }

  _getAriaLabel(beadId) {
    const step = this.steps.find(s => s.beadId === beadId);
    return step ? `${step.title}` : beadId;
  }

  // ─────────────────────────────────────────────────────────────────────
  // NAVEGACIÓN — Click en cuenta SVG → ir al paso correcto
  // ─────────────────────────────────────────────────────────────────────

  _onBeadClick(beadId) {
    const stepIndex = this._beadToStep[beadId];
    if (stepIndex !== undefined) {
      this.currentStepIndex = stepIndex;
      this.render();
    }
  }

  goToStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
      this.render();
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // ACTUALIZAR UI SVG — Sincronización de estados visuales
  // ─────────────────────────────────────────────────────────────────────

  updateActiveBeadUI() {
    const currentBeadId = this.steps[this.currentStepIndex].beadId;

    this.svgEl.querySelectorAll("[data-bead-id]").forEach(el => {
      const elBeadId = el.dataset.beadId;
      const elStepIndex = this._beadToStep[elBeadId];

      el.classList.remove("active", "completed");

      if (elBeadId === currentBeadId) {
        el.classList.add("active");
      } else if (elStepIndex !== undefined && elStepIndex < this.currentStepIndex) {
        el.classList.add("completed");
      }
    });

    // Hacer scroll suave al elemento activo si está fuera de vista
    const activeEl = this.svgEl.querySelector("[data-bead-id].active");
    if (activeEl) {
      // No scrollIntoView en SVG, pero podemos asegurar que el
      // contenedor del SVG esté visible
      const wrapper = this.svgEl.closest(".rosary-visual-wrapper");
      if (wrapper) {
        wrapper.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  new RosaryApp();
});
