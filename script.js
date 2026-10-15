/* ===== Edit your skills here ===== */
var SKILLS = [
  { name: "HTML", level: 80 },
  { name: "CSS", level: 70 },
  { name: "JavaScript", level: 55 },
  { name: "Git and GitHub", level: 60 }
];

/* ===== Theme toggle ===== */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  function apply(t) {
    root.setAttribute("data-theme", t);
    btn.textContent = t === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  apply(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

/* ===== Typing tagline ===== */
(function () {
  var el = document.getElementById("tagline");
  if (!el) return;
  var text = el.dataset.text || "";
  var i = 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = text; return; }
  (function type() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(type, 35);
  })();
})();

/* ===== Skills ===== */
(function () {
  var grid = document.getElementById("skills-grid");
  if (!grid) return;
  var card = document.createElement("article");
  card.className = "card";
  SKILLS.forEach(function (s) {
    var label = document.createElement("div");
    label.textContent = s.name + " - " + s.level + "%";
    var bar = document.createElement("div");
    bar.className = "skill-bar";
    var fill = document.createElement("span");
    fill.style.width = s.level + "%";
    bar.appendChild(fill);
    card.appendChild(label);
    card.appendChild(bar);
  });
  grid.appendChild(card);
})();

/* ===== Projects (from projects.json) ===== */
async function loadProjects() {
  var grid = document.getElementById("project-grid");
  if (!grid) return;
  try {
    var response = await fetch("projects.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    var projects = await response.json();
    grid.innerHTML = "";
    projects.forEach(function (p) { grid.appendChild(createProjectCard(p)); });
  } catch (error) {
    console.warn("Projects could not be loaded:", error);
    grid.innerHTML = "";
    var msg = document.createElement("p");
    msg.className = "status-message error-text";
    msg.textContent = "Projects could not be loaded. Please try again later.";
    grid.appendChild(msg);
  }
}

function createProjectCard(project) {
  var card = document.createElement("article");
  card.className = "card project-card";

  var img = document.createElement("img");
  img.src = "profile/" + project.screenshot;
  img.alt = "Screenshot of " + project.title;
  img.loading = "lazy";
  img.onerror = function () { img.remove(); };
  card.appendChild(img);

  var body = document.createElement("div");
  body.className = "project-body";

  var title = document.createElement("h3");
  title.textContent = project.title;
  body.appendChild(title);

  var desc = document.createElement("p");
  desc.textContent = project.description;
  body.appendChild(desc);

  var tech = document.createElement("ul");
  tech.className = "tag-list";
  (project.technologies || []).forEach(function (t) {
    var li = document.createElement("li");
    li.textContent = t;
    tech.appendChild(li);
  });
  body.appendChild(tech);

  if (project.role){
    var role = document.createElement("p");
    role.className = "project-role";
    role.textContent = "My role: " + project.role;
    body.appendChild(role);
  }

   if (project.link){
    var a = document.createElement("a");
    a.href = project.link;
    a.className = "btn btn-dark";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "View project";
    body.appendChild(a);
  }

  card.appendChild(body);
  return card;
}
loadProjects();

/* ===== Active nav link ===== */
(function () {
  var links = document.querySelectorAll(".nav-links a");
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach(function (s) { obs.observe(s); });
})();

/* ===== Contact form validation ===== */
(function () {
  var form = document.getElementById("contact-form");
  var ok = document.getElementById("form-success");
  if (!form) return;
  function setErr(id, msg) {
    document.getElementById(id + "-error").textContent = msg;
    return !msg;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ok.hidden = true;
    var n = form.elements["name"].value.trim();
    var m = form.elements["email"].value.trim();
    var msg = form.elements["message"].value.trim();
    var a = setErr("name", n ? "" : "Enter your name.");
    var b = setErr("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m) ? "" : "Enter a valid email address.");
    var c = setErr("message", msg.length >= 10 ? "" : "Write at least 10 characters.");
    if (a && b && c) { ok.hidden = false; form.reset(); }
  });
})();

/* ===== Back to top ===== */
(function(){
  var b = document.getElementById("back to top");
  if (!b) return;
  window.addEventListener("scroll", function () { b.hidden = window,scrollY < 400;});
  b.addEventListener("click", function () { window.scrollTo({ top: 0, behaviour: "smooth"});});
})();

/* ===== Latest GitHub repositories ===== */
async function loadRepos() {
  var list = document.getElementById("repo-list");
  if (!list) return;
  try {
    var res = await fetch("https://api.github.com/users/lealeron19/repos?sort=updated&per_page=4");
    if (!res.ok) throw new Error("HTTP" + res.status);
    var repos = await res.json();
    list.innerHTML = "";
    repos.forEach(function (r) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = r.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = r.name;
      var lang = document.createElement("span");
      lang.textContent = r.language || "";
      li.append(a, lang);
      list.appendChild(li);
    });
    } catch (error) {
      console.warn("GitHub data unavailable;", error);
      list.innerHTML = '<li class="status-message">Repositories could not be loded.</li>';
  }
}
loadRepos();
