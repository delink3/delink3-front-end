for (const listenerElement of document.querySelectorAll(".unclicked")) {
  listenerElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("unclicked")) {
      event.target.classList.remove("unclicked")
    }
  })
}


let themeButton = document.querySelector(".theme-changer")
themeButton.addEventListener("click", () => {
  let theme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light'
  setTheme(theme)
})
if (localStorage) {
  let initialTheme = 'light'
  if (localStorage.getItem('theme')) {
      initialTheme = localStorage.getItem('theme')
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      localStorage.setItem('theme', 'dark');
    }
  }
  setTheme(initialTheme)
} else {
  themeButton.style = "display:none;"
}

function setTheme(theme) {
  document.body.setAttribute('class', theme)
  localStorage.setItem('theme', theme)
}