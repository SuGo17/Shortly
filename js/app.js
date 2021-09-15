class App {
  links = [];
  body = document.querySelector("body");
  constructor() {
    if (JSON.parse(localStorage.getItem("links")))
      this.links = JSON.parse(localStorage.getItem("links"));
    this.#display(this.links);
    const form = document.querySelector(".shorten-form form");
    const link = document.querySelector(".shorten-form form input");
    this.#mobileNav();
    form.addEventListener("submit", this.#formSubmitHandler);
    link.addEventListener("input", this.#inputChangeHandler);
    this.#updateCopyBtns();
  }
  #mobileNav = () => {
    const menu = document.querySelector(".menu");
    const navBar = document.querySelector(".nav-bar");
    const body = document.querySelector("body");
    menu.addEventListener("click", () => {
      navBar.classList.toggle("open");
      if (navBar.classList.contains("open")) {
        menu.style.color = "#FFF";
        menu.setAttribute("name", "close-outline");
        body.style.overflow = "hidden";
      } else {
        menu.style.color = "#333";
        menu.setAttribute("name", "menu-outline");
        body.style.overflow = "scroll";
      }
    });
  };
  #formSubmitHandler = async (e) => {
    e.preventDefault();
    const errorEle = document.querySelector(".shorten-form .error");
    if (
      !link.value.trim() ||
      link.value.split(" ").length > 1 ||
      link.value.split(".").length === 1 ||
      link.value.split(".").includes("")
    ) {
      link.classList.remove("err");
      link.classList.add("err");
      errorEle.style.opacity = 1;
      link.focus();
      return;
    }
    console.log("hello");
    this.#showLoadBar(this.body, this.progress);
    const linkURL = link.value.split("https://").filter((ele) => ele !== "")[0];
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${linkURL}`);
    const data = await res.json();
    if (!Boolean(data.ok)) {
      this.#updateLoadBar(this.body, this.progress);
      return;
    }
    let abc = false;
    this.links.forEach((ele) => {
      if (ele.original_link === data.result.original_link) abc = true;
      else abc = false;
    });
    if (abc) {
      this.#updateLoadBar(this.body, this.progress);
      return;
    }
    this.links.push({ id: this.links.length + 1, ...data.result });
    localStorage.setItem("links", JSON.stringify(this.links));
    this.#display(this.links);
    link.value = "";
    this.#updateLoadBar(this.body, this.progress);
  };
  #inputChangeHandler = (e) => {
    const errorEle = document.querySelector(".shorten-form .error");
    e.target.classList.remove("err");
    errorEle.style.opacity = 0;
  };
  #reduceLen(str) {
    if (window.innerWidth > 1284) {
      if (str.length <= 73) return str;
      return str.slice(0, 70).padEnd(73, ".");
    } else if (window.innerWidth > 1024) {
      if (str.length <= 55) return str;
      return str.slice(0, 52).padEnd(55, ".");
    } else if (window.innerWidth > 950) {
      if (str.length <= 47) return str;
      return str.slice(0, 44).padEnd(47, ".");
    } else if (window.innerWidth > 540) {
      if (str.length <= 66) return str;
      return str.slice(0, 63).padEnd(66, ".");
    } else if (window.innerWidth > 480) {
      if (str.length <= 37) return str;
      return str.slice(0, 34).padEnd(37, ".");
    } else if (window.innerWidth > 375) {
      if (str.length <= 40) return str;
      return str.slice(0, 37).padEnd(40, ".");
    } else if (window.innerWidth > 280) {
      if (str.length <= 32) return str;
      return str.slice(0, 29).padEnd(32, ".");
    } else {
      if (str.length <= 27) return str;
      return str.slice(0, 24).padEnd(27, ".");
    }
  }
  #updateCopyBtns() {
    const allLinks = document.querySelectorAll(".link");
    allLinks.forEach((ele) => {
      ele.addEventListener("click", this.#copyClickHandler);
    });
  }
  #copyClickHandler(e) {
    const target = e.target;
    const allCopyBtns = [...document.querySelectorAll(".copy-link")];
    if (!target.classList.contains("copy-link")) return;
    allCopyBtns.forEach((ele) => {
      ele.textContent = "Copy";
      ele.style.background = "#23adad";
      ele.style.border = "1px solid #23adad";
    });
    const children = target.parentElement.children;
    navigator.clipboard.writeText(children[0].textContent);
    children[1].textContent = "Copied!";
    children[1].style.background = "hsl(257, 27%, 26%)";
    children[1].style.border = "1px solid hsl(257, 27%, 26%)";
  }
  #display(arr) {
    const links = [...arr];
    links.reverse();
    // prettier-ignore
    const container = document.querySelector(".features-section .links-container");
    container.innerHTML = "";
    links.forEach((ele) => {
      const link = document.createElement("div");
      link.classList.add("link");
      // prettier-ignore
      link.innerHTML = `<p class="main-link">${this.#reduceLen(ele.original_link)}</p>
      <div class="shortened-link-container">
        <p class="shortened-link">${ele.full_short_link}</p>
        <button class="copy-link btn">Copy</button>
      </div>`;
      container.append(link);
    });
    this.#updateCopyBtns();
  }
  #showLoadBar(body, progress) {
    if (progress) return;
    const loadBar = document.createElement("div");
    loadBar.innerHTML = "<b></b><i></i>";
    loadBar.id = "progress";
    body.append(loadBar);
    setTimeout(() => {
      loadBar.style.width = "75%";
    }, 10);
  }
  #updateLoadBar() {
    const loadBar = document.querySelector("#progress");
    if (!loadBar) return;
    console.log(loadBar);
    setTimeout(() => {
      loadBar.style.width = "100%";
    }, 10);
    setTimeout(() => {
      loadBar.remove();
    }, 1100);
  }
}

export default App;
