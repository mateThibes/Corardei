const PRAYERS = {
  signumCrucis: "Por la señal de la Santa Cruz, de nuestros enemigos líbranos, Señor Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.",
  credo: "Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo...",
  padreNuestro: "Padre nuestro que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.",
  aveMaria: "Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
  gloria: "Gloria al Padre y al Hijo y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  fatima: "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.",
  salve: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas..."
};

const MYSTERIES_BY_TYPE = [
  {
    name: "Gozosos",
    days: [1, 6], // Lunes y Sábados
    mysteries: [
      "1. La Encarnación del Hijo de Dios",
      "2. La Visitación de Nuestra Señora a su prima Santa Isabel",
      "3. El Nacimiento del Hijo de Dios",
      "4. La Presentación de Jesús en el Templo",
      "5. El Niño Jesús perdido y hallado en el Templo"
    ]
  },
  {
    name: "Dolorosos",
    days: [2, 5], // Martes y Viernes
    mysteries: [
      "1. La Oración en el Huerto",
      "2. La Flagelación de Nuestro Señor",
      "3. La Coronación de Espinas",
      "4. Jesús con la Cruz a Cuestas",
      "5. La Crucifixión y Muerte de Jesús"
    ]
  },
  {
    name: "Gloriosos",
    days: [0, 3], // Domingo y Miércoles
    mysteries: [
      "1. La Resurrección del Señor",
      "2. La Ascensión del Señor al Cielo",
      "3. La Venida del Espíritu Santo",
      "4. La Asunción de la Virgen María",
      "5. La Coronación de la Virgen María"
    ]
  },
  {
    name: "Luminosos",
    days: [4], // Jueves
    mysteries: [
      "1. El Bautismo en el Jordán",
      "2. La Autorrevelación en las Bodas de Caná",
      "3. El Anuncio del Reino de Dios",
      "4. La Transfiguración",
      "5. La Institución de la Eucaristía"
    ]
  }
];

class RosaryApp {
  constructor() {
    this.currentStepIndex = 0;
    this.steps = [];
    this.selectedMysterySet = this.getMysterySetByDay(new Date().getDay());

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

  buildSteps() {
    this.steps = [];

    // 1. Apertura
    this.steps.push({
      title: "Señal de la Cruz",
      instruction: "Sostén la cruz del rosario",
      text: PRAYERS.signumCrucis,
      groupLabel: "Inicio"
    });
    this.steps.push({
      title: "Credo de los Apóstoles",
      instruction: "En la cruz",
      text: PRAYERS.credo,
      groupLabel: "Inicio"
    });
    this.steps.push({
      title: "Padrenuestro",
      instruction: "Primera cuenta grande",
      text: PRAYERS.padreNuestro,
      groupLabel: "Inicio"
    });

    for (let i = 1; i <= 3; i++) {
      this.steps.push({
        title: `Avemaría (${i}/3)`,
        instruction: "Cuentas chicas: Aumento de la Fe, Esperanza y Caridad",
        text: PRAYERS.aveMaria,
        groupLabel: "Inicio"
      });
    }

    this.steps.push({
      title: "Gloria y Oración de Fátima",
      instruction: "En la cadena antes del primer misterio",
      text: `${PRAYERS.gloria}\n\n${PRAYERS.fatima}`,
      groupLabel: "Inicio"
    });

    // 2. Las 5 Decenas
    this.selectedMysterySet.mysteries.forEach((mysteryTitle, mIdx) => {
      const decadeLabel = `Misterio ${mIdx + 1}`;

      // Anuncio y Padrenuestro
      this.steps.push({
        title: mysteryTitle,
        instruction: "Medita el misterio y reza 1 Padrenuestro en la cuenta grande",
        text: PRAYERS.padreNuestro,
        groupLabel: decadeLabel
      });

      // 10 Avemarías
      for (let bead = 1; bead <= 10; bead++) {
        this.steps.push({
          title: `Avemaría (${bead}/10)`,
          instruction: `Decena ${mIdx + 1} - Sigue meditando el misterio`,
          text: PRAYERS.aveMaria,
          groupLabel: decadeLabel
        });
      }

      // Gloria y Fátima
      this.steps.push({
        title: "Gloria y Jaculatoria",
        instruction: "Cierre de la decena",
        text: `${PRAYERS.gloria}\n\n${PRAYERS.fatima}`,
        groupLabel: decadeLabel
      });
    });

    // 3. Conclusión
    this.steps.push({
      title: "La Salve",
      instruction: "Sostén la medalla central",
      text: PRAYERS.salve,
      groupLabel: "Cierre"
    });
    this.steps.push({
      title: "Señal de la Cruz Final",
      instruction: "Fin del Santo Rosario",
      text: PRAYERS.signumCrucis,
      groupLabel: "Cierre"
    });
  }

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
  }

  render() {
    const current = this.steps[this.currentStepIndex];
    const total = this.steps.length;

    this.titleEl.textContent = current.title;
    this.instructionEl.textContent = current.instruction;
    this.textEl.textContent = current.text;
    this.badgeEl.textContent = `${this.selectedMysterySet.name} · ${current.groupLabel}`;
    this.counterEl.textContent = `Paso ${this.currentStepIndex + 1} de ${total}`;

    const progressPercent = ((this.currentStepIndex + 1) / total) * 100;
    this.progressEl.style.width = `${progressPercent}%`;

    this.prevBtn.disabled = this.currentStepIndex === 0;
    this.nextBtn.disabled = this.currentStepIndex === total - 1;
    this.nextBtn.textContent = this.currentStepIndex === total - 1 ? "Completado" : "Siguiente →";
    
    if (this.svgEl) {
      this.updateActiveBeadUI();
    }
  }

  renderRosaryMap() {
    this.svgEl.innerHTML = ""; // Limpiar previo

    // 1. Coordenadas de inicio vertical (cruz y primeras cuentas)
    const linearBeads = [
      { x: 200, y: 410, isCross: true, stepIndex: 0 },
      { x: 200, y: 360, r: 6, stepIndex: 2 }, // Padre Nuestro
      { x: 200, y: 335, r: 4, stepIndex: 3 }, // Ave María 1
      { x: 200, y: 315, r: 4, stepIndex: 4 }, // Ave María 2
      { x: 200, y: 295, r: 4, stepIndex: 5 }, // Ave María 3
      { x: 200, y: 270, r: 6, stepIndex: 6 }, // Gloria
    ];

    linearBeads.forEach(b => {
      if (b.isCross) {
        const cross = document.createElementNS("http://www.w3.org/2000/svg", "path");
        cross.setAttribute("d", "M 196,380 h 8 v 12 h 12 v 8 h -12 v 20 h -8 v -20 h -12 v -8 h 12 z");
        cross.classList.add("bead-cross");
        cross.dataset.step = b.stepIndex.toString();
        cross.addEventListener("click", () => this.goToStep(b.stepIndex));
        this.svgEl.appendChild(cross);
      } else {
        this.drawBead(b.x, b.y, b.r || 4, b.stepIndex, b.r === 6);
      }
    });

    // 2. Coordenadas del lazo elíptico (5 decenas = 50 pequeñas + 5 grandes)
    const centerX = 200;
    const centerY = 140;
    const rx = 140;
    const ry = 110;

    let stepOffset = 7; 

    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI / 2) + ((i + 1) * (2 * Math.PI / 50));
      const x = centerX + rx * Math.cos(angle);
      const y = centerY + ry * Math.sin(angle);
      const isLarge = i % 10 === 0;

      this.drawBead(x, y, isLarge ? 6 : 4, stepOffset, isLarge);
      stepOffset += (isLarge ? 1 : 1); 
    }
  }

  drawBead(cx, cy, r, stepIndex, isLarge) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx.toString());
    circle.setAttribute("cy", cy.toString());
    circle.setAttribute("r", r.toString());
    circle.classList.add("bead");
    if (isLarge) circle.classList.add("large");
    circle.dataset.step = stepIndex.toString();

    circle.addEventListener("click", () => this.goToStep(stepIndex));
    this.svgEl.appendChild(circle);
  }

  goToStep(index) {
    this.currentStepIndex = index;
    this.render();
  }

  updateActiveBeadUI() {
    this.svgEl.querySelectorAll(".bead, .bead-cross").forEach((el) => {
      const beadStep = parseInt(el.dataset.step || "-1", 10);
      el.classList.remove("active", "completed");

      if (beadStep === this.currentStepIndex) {
        el.classList.add("active");
      } else if (beadStep < this.currentStepIndex) {
        el.classList.add("completed");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new RosaryApp();
});
