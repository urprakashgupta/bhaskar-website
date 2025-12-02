// main.js - common interactions for TheFitBhaskar.in

// Toggle mobile navigation
const navToggle = () => {
  const nav = document.querySelector(".nav-links");
  if (nav) nav.classList.toggle("show");
};

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav
  const burger = document.querySelector(".hamburger");
  if (burger) burger.addEventListener("click", navToggle);

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Mini BMI teaser (home)
  const miniBmiForm = document.querySelector("#mini-bmi-form");
  if (miniBmiForm) {
    miniBmiForm.addEventListener("submit", e => {
      e.preventDefault();
      const h = parseFloat(miniBmiForm.querySelector("[name='height']")?.value || "0");
      const w = parseFloat(miniBmiForm.querySelector("[name='weight']")?.value || "0");
      const output = document.querySelector("#mini-bmi-output");
      if (!h || !w) {
        output.textContent = "Please enter height and weight.";
        return;
      }
      const bmi = w / Math.pow(h / 100, 2);
      output.innerHTML = `BMI (approx): ${bmi.toFixed(1)}. For full tools, visit <a href="tools.html">Tools page</a>.`;
    });
  }

  // Full BMI calculator (tools)
  const bmiForm = document.querySelector("#bmi-form");
  if (bmiForm) {
    bmiForm.addEventListener("submit", e => {
      e.preventDefault();
      const h = parseFloat(bmiForm.height.value);
      const w = parseFloat(bmiForm.weight.value);
      const bmiVal = document.querySelector("#bmi-value");
      const bmiCat = document.querySelector("#bmi-category");
      if (!h || !w) {
        bmiVal.textContent = "Please enter valid height and weight.";
        bmiCat.textContent = "";
        return;
      }
      const bmi = w / Math.pow(h / 100, 2);
      bmiVal.textContent = bmi.toFixed(1);
      let category = "Normal";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";
      bmiCat.textContent = category;
    });
  }

  // Calorie estimator (tools)
  const calorieForm = document.querySelector("#calorie-form");
  if (calorieForm) {
    calorieForm.addEventListener("submit", e => {
      e.preventDefault();
      const weight = parseFloat(calorieForm.weight.value);
      const goal = calorieForm.goal.value;
      const output = document.querySelector("#calorie-output");
      if (!weight) {
        output.textContent = "Enter a valid weight.";
        return;
      }
      const maintain = weight * 30;
      let suggestion = `${maintain - 200} - ${maintain + 150} kcal (maintain)`;
      if (goal === "lose") suggestion = `${maintain - 400} - ${maintain - 200} kcal (lose)`;
      if (goal === "gain") suggestion = `${maintain + 200} - ${maintain + 400} kcal (gain)`;
      output.textContent = suggestion;
    });
  }

  // Water intake suggestion (tools)
  const waterForm = document.querySelector("#water-form");
  if (waterForm) {
    waterForm.addEventListener("submit", e => {
      e.preventDefault();
      const weight = parseFloat(waterForm.weight.value);
      const output = document.querySelector("#water-output");
      if (!weight) {
        output.textContent = "Enter a valid weight.";
        return;
      }
      const liters = (weight * 0.033).toFixed(2);
      output.textContent = `${liters} liters (approx) per day.`;
    });
  }

  // Contact form demo
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
      }
      alert("Form submitted (demo only).");
      contactForm.reset();
    });
  }

  // Community blog posts (localStorage on blog page)
  const communityForm = document.querySelector("#community-form");
  const communityFeed = document.querySelector("#community-posts");
  if (communityForm && communityFeed) {
    const storageKey = "communityPosts";
    let storageOk = true;
    try {
      const testKey = "__community_test";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
    } catch (err) {
      storageOk = false;
    }

    const readPosts = () => {
      if (!storageOk) return [];
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        return [];
      }
    };

    const savePosts = posts => {
      if (!storageOk) return;
      localStorage.setItem(storageKey, JSON.stringify(posts.slice(0, 200)));
    };

    const renderPosts = () => {
      communityFeed.innerHTML = "";
      const posts = readPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (!posts.length) {
        const empty = document.createElement("div");
        empty.className = "community-empty";
        empty.textContent = storageOk
          ? "No posts yet. Be the first to share!"
          : "Storage is blocked in this browser. Posts cannot be saved.";
        communityFeed.appendChild(empty);
        return;
      }

      posts.forEach(post => {
        const item = document.createElement("article");
        item.className = "community-post";

        const body = document.createElement("p");
        body.className = "community-body";
        body.textContent = post.body || "";

        const meta = document.createElement("div");
        meta.className = "community-meta";
        const date = document.createElement("span");
        date.textContent = new Date(post.createdAt || Date.now()).toLocaleDateString();
        const author = document.createElement("span");
        author.textContent = post.author ? `— ${post.author}` : "— Anonymous";
        meta.appendChild(date);
        meta.appendChild(author);

        item.appendChild(body);
        item.appendChild(meta);
        communityFeed.appendChild(item);
      });
    };

    communityForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!storageOk) {
        alert("Cannot save posts because storage is blocked in this browser.");
        return;
      }
      const authorInput = communityForm.querySelector("#post-author");
      const bodyInput = communityForm.querySelector("#post-body");
      const author = authorInput?.value.trim() || "Anonymous";
      const body = bodyInput?.value.trim();
      if (!body) {
        alert("Write something before publishing.");
        return;
      }
      const posts = readPosts();
      posts.unshift({
        id: Date.now(),
        author,
        body,
        createdAt: new Date().toISOString()
      });
      savePosts(posts);
      communityForm.reset();
      renderPosts();
    });

    renderPosts();
  }

  // -----------------------------
  // Shared Google Sheet (Food tab)
  // -----------------------------
  const sheetId = "1ySzTGIRSipjieOl38WXnVHk-LCmVGKlq3YEx22kEgxE";
  const sheetName = "Food";
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;
  let sheetCache = null;
  let sheetPromise = null;

  const parseGvizJson = raw => {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    try {
      const json = JSON.parse(raw.substring(start, end + 1));
      return json?.table?.rows || [];
    } catch (err) {
      console.error("Sheet parse error", err);
      return null;
    }
  };

  const parseNumber = val => {
    if (val === null || val === undefined) return 0;
    const num = parseFloat(String(val).replace(/[^\d\.-]/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const loadSheetData = async (forceRefresh = false) => {
    if (forceRefresh) {
      sheetCache = null;
      sheetPromise = null;
    }
    if (sheetCache) return sheetCache;
    if (sheetPromise) return sheetPromise;
    sheetPromise = (async () => {
      const res = await fetch(sheetUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const rows = parseGvizJson(text);
      if (!rows) throw new Error("Could not parse sheet data");
      sheetCache = rows
        .map(r => {
          const c = r.c || [];
          return {
            food: c[0]?.v || "",
            state: c[1]?.v || "",
            calories: c[2]?.v || "",
            caloriesNum: parseNumber(c[2]?.v),
            protein: c[3]?.v || "",
            proteinNum: parseNumber(c[3]?.v),
            carbs: c[4]?.v || "",
            carbsNum: parseNumber(c[4]?.v),
            fat: c[5]?.v || "",
            fatNum: parseNumber(c[5]?.v),
            fibre: c[6]?.v || "",
            fibreNum: parseNumber(c[6]?.v),
            other: c[7]?.v || ""
          };
        })
        .filter(item => item.food);
      return sheetCache;
    })();
    return sheetPromise;
  };

  // Diet page: live table from sheet
  const foodTableBody = document.querySelector("#food-tbody");
  if (foodTableBody) {
    const searchInput = document.querySelector("#food-search");
    const stateFilter = document.querySelector("#state-filter");
    const refreshBtn = document.querySelector("#refresh-sheet");
    const statusEl = document.querySelector("#sheet-status");
    const chipCalories = document.querySelector("#chip-calories");
    const chipProtein = document.querySelector("#chip-protein");
    const chipCarbs = document.querySelector("#chip-carbs");
    const chipFat = document.querySelector("#chip-fat");
    const chipFibre = document.querySelector("#chip-fibre");
    let foodData = [];

    const renderChips = entry => {
      chipCalories.textContent = entry?.calories || "—";
      chipProtein.textContent = entry?.protein || "—";
      chipCarbs.textContent = entry?.carbs || "—";
      chipFat.textContent = entry?.fat || "—";
      chipFibre.textContent = entry?.fibre || "—";
    };

    const renderTable = rows => {
      if (!rows.length) {
        foodTableBody.innerHTML = `<tr><td colspan="9">No matches. Try a different keyword.</td></tr>`;
        renderChips(null);
        return;
      }
      const safeText = val => (val === null || val === undefined ? "" : val);
      foodTableBody.innerHTML = rows
        .map(
          row => `<tr>
            <td>${safeText(row.food)}</td>
            <td>${safeText(row.state)}</td>
            <td>${safeText(row.calories)}</td>
            <td>${safeText(row.protein)}</td>
            <td>${safeText(row.carbs)}</td>
            <td>${safeText(row.fat)}</td>
            <td>${safeText(row.fibre)}</td>
            <td>${safeText(row.other)}</td>
            <td><a class="btn btn-secondary btn-ghost" href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(row.food + " food")}" target="_blank" rel="noopener">View</a></td>
          </tr>`
        )
        .join("");
      renderChips(rows[0]);
    };

    const applyFilters = () => {
      const q = (searchInput?.value || "").toLowerCase().trim();
      const state = stateFilter?.value || "";
      const filtered = foodData.filter(item => {
        const matchesQuery = q ? item.food.toLowerCase().includes(q) || (item.other || "").toLowerCase().includes(q) : true;
        const matchesState = state ? item.state === state : true;
        return matchesQuery && matchesState;
      });
      renderTable(filtered.slice(0, 150));
      if (statusEl) statusEl.textContent = `Showing ${Math.min(filtered.length, 150)} of ${filtered.length} foods from Google Sheet.`;
    };

    const fetchSheet = async (force = false) => {
      if (statusEl) statusEl.textContent = "Loading data from Google Sheet…";
      try {
        foodData = await loadSheetData(force);
        applyFilters();
        if (statusEl) statusEl.textContent = `Connected. Last pulled ${new Date().toLocaleTimeString()}.`;
      } catch (err) {
        console.error(err);
        foodTableBody.innerHTML = `<tr><td colspan="9">Could not load sheet. Check sharing or refresh.</td></tr>`;
        if (statusEl) statusEl.textContent = "Error loading sheet. Check link/sharing and try again.";
        renderChips(null);
      }
    };

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (stateFilter) stateFilter.addEventListener("change", applyFilters);
    if (refreshBtn) refreshBtn.addEventListener("click", () => fetchSheet(true));

    fetchSheet();
  }

  // Home page: day calorie/macro planner (uses same sheet)
  const plannerSection = document.querySelector("#calorie-planner");
  if (plannerSection) {
    const foodInput = document.querySelector("#planner-food");
    const mealSelect = document.querySelector("#planner-meal");
    const noteInput = document.querySelector("#planner-note");
    const addBtn = document.querySelector("#planner-add");
    const resetBtn = document.querySelector("#planner-reset");
    const downloadBtn = document.querySelector("#planner-download");
    const foodOptions = document.querySelector("#planner-food-options");
    const plannerStatus = document.querySelector("#planner-status");
    const mealClearButtons = document.querySelectorAll(".meal-card-head .btn-ghost");
    const mealBodies = {
      breakfast: document.querySelector("#meal-breakfast"),
      lunch: document.querySelector("#meal-lunch"),
      snacks: document.querySelector("#meal-snacks"),
      dinner: document.querySelector("#meal-dinner")
    };
    const totalsEls = {
      calories: document.querySelector("#sum-calories"),
      protein: document.querySelector("#sum-protein"),
      carbs: document.querySelector("#sum-carbs"),
      fat: document.querySelector("#sum-fat"),
      fibre: document.querySelector("#sum-fibre")
    };

    let foodData = [];
    const meals = { breakfast: [], lunch: [], snacks: [], dinner: [] };

    const mealLabel = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      snacks: "Evening Snacks",
      dinner: "Dinner"
    };

    const formatVal = (num, suffix) => `${num.toFixed(0)} ${suffix}`;

    const renderOptions = data => {
      if (!foodOptions) return;
      const options = data.slice(0, 500).map(item => `<option value="${item.food}"></option>`).join("");
      foodOptions.innerHTML = options;
    };

    const renderMeals = () => {
      Object.keys(mealBodies).forEach(mealKey => {
        const tbody = mealBodies[mealKey];
        if (!tbody) return;
        const rows = meals[mealKey];
        if (!rows.length) {
          tbody.innerHTML = `<tr><td colspan="7">No items yet.</td></tr>`;
          return;
        }
        tbody.innerHTML = rows
          .map(
            (item, idx) => `<tr>
              <td>${item.food}</td>
              <td>${item.calories}</td>
              <td>${item.protein}</td>
              <td>${item.carbs}</td>
              <td>${item.fat}</td>
              <td>${item.note || ""}</td>
              <td><button class="btn btn-secondary btn-ghost remove-row" data-meal="${mealKey}" data-index="${idx}" type="button">×</button></td>
            </tr>`
          )
          .join("");
      });
    };

    const updateTotals = () => {
      const sums = { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
      Object.values(meals).forEach(list => {
        list.forEach(item => {
          sums.calories += item.caloriesNum;
          sums.protein += item.proteinNum;
          sums.carbs += item.carbsNum;
          sums.fat += item.fatNum;
          sums.fibre += item.fibreNum;
        });
      });
      if (totalsEls.calories) totalsEls.calories.textContent = formatVal(sums.calories, "kcal");
      if (totalsEls.protein) totalsEls.protein.textContent = formatVal(sums.protein, "g");
      if (totalsEls.carbs) totalsEls.carbs.textContent = formatVal(sums.carbs, "g");
      if (totalsEls.fat) totalsEls.fat.textContent = formatVal(sums.fat, "g");
      if (totalsEls.fibre) totalsEls.fibre.textContent = formatVal(sums.fibre, "g");
    };

    const addToMeal = () => {
      const query = (foodInput?.value || "").trim();
      const mealKey = mealSelect?.value || "breakfast";
      if (!query) {
        plannerStatus.textContent = "Enter a food name from the sheet.";
        return;
      }
      const match = foodData.find(item => item.food.toLowerCase() === query.toLowerCase()) ||
        foodData.find(item => item.food.toLowerCase().includes(query.toLowerCase()));
      if (!match) {
        plannerStatus.textContent = "Food not found in sheet. Check spelling or use the suggestions list.";
        return;
      }
      const note = noteInput?.value || "";
      meals[mealKey].push({
        food: match.food,
        calories: match.calories,
        caloriesNum: match.caloriesNum,
        protein: match.protein,
        proteinNum: match.proteinNum,
        carbs: match.carbs,
        carbsNum: match.carbsNum,
        fat: match.fat,
        fatNum: match.fatNum,
        fibre: match.fibre,
        fibreNum: match.fibreNum,
        note
      });
      renderMeals();
      updateTotals();
      plannerStatus.textContent = `${match.food} added to ${mealLabel[mealKey]}. Adjust portion in note if needed.`;
      if (foodInput) foodInput.value = "";
      if (noteInput) noteInput.value = "";
    };

    const clearMeal = mealKey => {
      meals[mealKey] = [];
      renderMeals();
      updateTotals();
    };

    const clearDay = () => {
      Object.keys(meals).forEach(k => {
        meals[k] = [];
      });
      renderMeals();
      updateTotals();
      plannerStatus.textContent = "Day cleared.";
    };

    const buildPdfHtml = () => {
      const sumText = `${totalsEls.calories?.textContent || ""}, P ${totalsEls.protein?.textContent || ""}, C ${totalsEls.carbs?.textContent || ""}, F ${totalsEls.fat?.textContent || ""}, Fibre ${totalsEls.fibre?.textContent || ""}`;
      const tables = Object.keys(meals)
        .map(mealKey => {
          const rows = meals[mealKey]
            .map(
              item => `<tr>
                <td>${item.food}</td>
                <td>${item.calories}</td>
                <td>${item.protein}</td>
                <td>${item.carbs}</td>
                <td>${item.fat}</td>
                <td>${item.note || ""}</td>
              </tr>`
            )
            .join("");
          const body = rows || `<tr><td colspan="6">No items.</td></tr>`;
          return `<h3>${mealLabel[mealKey]}</h3>
            <table>
              <thead><tr><th>Food</th><th>Cal</th><th>P</th><th>C</th><th>F</th><th>Note</th></tr></thead>
              <tbody>${body}</tbody>
            </table>`;
        })
        .join("<br>");

      return `<h2>Day Calories & Macros</h2>
        <p>${sumText}</p>
        ${tables}
        <p style="margin-top:12px;">Source: Google Sheet Food tab (${new Date().toLocaleDateString()})</p>`;
    };

    const downloadPdf = () => {
      const html = buildPdfHtml();
      const popup = window.open("", "_blank", "width=900,height=900");
      if (!popup) return;
      popup.document.write(`<!doctype html><html><head><title>Day Calories</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
          table { width: 100%; border-collapse: collapse; margin: 8px 0; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
          th { background: #eef7ff; }
        </style>
      </head><body>${html}</body></html>`);
      popup.document.close();
      popup.focus();
      popup.print();
    };

    if (addBtn) addBtn.addEventListener("click", addToMeal);
    if (resetBtn) resetBtn.addEventListener("click", clearDay);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPdf);
    if (plannerStatus) plannerStatus.textContent = "Loading foods from Google Sheet…";

    if (mealClearButtons) {
      mealClearButtons.forEach(btn => {
        btn.addEventListener("click", () => clearMeal(btn.dataset.meal));
      });
    }

    plannerSection.addEventListener("click", e => {
      const btn = e.target.closest(".remove-row");
      if (!btn) return;
      const mealKey = btn.getAttribute("data-meal");
      const idx = Number(btn.getAttribute("data-index"));
      if (!Number.isInteger(idx) || !meals[mealKey]) return;
      meals[mealKey].splice(idx, 1);
      renderMeals();
      updateTotals();
    });

    loadSheetData()
      .then(data => {
        foodData = data;
        renderOptions(foodData);
        plannerStatus.textContent = "Sheet connected. Add foods to your meals.";
      })
      .catch(err => {
        console.error(err);
        plannerStatus.textContent = "Could not load sheet data. Check sharing and reload.";
      });
  }
});
