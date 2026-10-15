// ===== SETTINGS: change this to your GitHub username =====
const GITHUB_USERNAME = "lealeron19";

// ===== 1. PROJECTS FROM JSON =====
async function loadProjects() {
  const grid = document.getElementById("project-grid");

  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const projects = await response.json();

    grid.innerHTML = "";
    projects.forEach((project) => grid.appendChild(createProjectCard(project)));
  } catch (error) {
    console.warn("Projects could not be loaded:", error);
    grid.innerHTML = "";
    const msg = document.createElement("p");
    msg.className = "status-message error-text";
    msg.textContent = "Projects could not be loaded. Please try again later.";
    grid.appendChild(msg);
  }
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card project-card";

  const img = document.createElement("img");
  img.src = "profile/" + project.screenshot;
  img.alt = "Screenshot of " + project.title;
  img.loading = "lazy";
  img.onerror = () => img.remove(); // hide if the screenshot file is missing

  const title = document.createElement("h3");
  title.textContent = project.title;

  const desc = document.createElement("p");
  desc.textContent = project.description;

  const tech = document.createElement("ul");
  tech.className = "tag-list";
  project.technologies.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    tech.appendChild(li);
  });

  const role = document.createElement("p");
  role.className = "role";
  role.textContent = "My role: " + project.role;

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = project.link;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = project.linkLabel || "View project";

  card.append(img, title, desc, tech, role, link);
  return card;
}

// ===== 2. LATEST GITHUB REPOSITORIES =====
async function loadRepos() {
  const list = document.getElementById("repo-list");
  const url =
    "https://api.github.com/users/" + GITHUB_USERNAME + "/repos?sort=updated&per_page=5";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const repos = await response.json();

    list.innerHTML = "";
    if (repos.length === 0) {
      list.innerHTML = '<li class="status-message">No public repositories yet.</li>';
      return;
    }

    repos.forEach((repo) => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = repo.name;

      const lang = document.createElement("span");
      lang.className = "repo-language";
      lang.textContent = repo.language || "No language detected";

      li.append(link, lang);
      list.appendChild(li);
    });
  } catch (error) {
    console.warn("GitHub data unavailable:", error);
    list.innerHTML =
      '<li class="status-message error-text">GitHub data is unavailable right now. Please try again later.</li>';
  }
}

// ===== 3. CONTACT FORM =====
const form = document.getElementById("contact-form");
const successMsg = document.getElementById("form-success");

function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  document.getElementById(fieldId + "-error").textContent = message;
  input.closest(".field").classList.toggle("invalid", message !== "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMsg.hidden = true;

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let valid = true;

  if (name === "") { setError("name", "Enter your name."); valid = false; }
  else setError("name", "");

  if (email === "") { setError("email", "Enter your email address."); valid = false; }
  else if (!isValidEmail(email)) { setError("email", "Enter a valid email, like name@example.com."); valid = false; }
  else setError("email", "");

  if (message === "") { setError("message", "Write a message."); valid = false; }
  else setError("message", "");

  if (!valid) return;

  // A static site has no back end, so nothing is actually sent.
  form.reset();
  successMsg.hidden = false;
});

// ===== 4. MY OWN FEATURE: LIGHT / DARK THEME SWITCH =====
const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeButton.textContent = theme === "dark" ? "☀️" : "🌙";
  themeButton.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );
}

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) { /* storage blocked: ignore */ }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

themeButton.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
});

// ===== START =====
loadProjects();
loadRepos();
