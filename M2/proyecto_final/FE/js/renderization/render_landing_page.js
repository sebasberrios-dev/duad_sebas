const setupNavBarBtns = () => {
  const dndBtn = document.querySelectorAll(".navbar-item")[0];
  const contactBtn = document.querySelectorAll(".navbar-item")[1];
  const loginBtn = document.querySelectorAll(".navbar-item")[2];

  dndBtn.addEventListener("click", () => {
    window.location.href = "landing_page.html";
  });
  contactBtn.addEventListener("click", () => {
    window.location.href = "contact_me.html";
  });
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
};

const setupStartBtn = () => {
  const startBtn = document.querySelectorAll(".landing-page-button")[0];
  startBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavBarBtns();
  setupStartBtn();
});
