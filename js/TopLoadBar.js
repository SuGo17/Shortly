class TopLoadBar {
  updateLoadBar() {
    const loadBar = document.querySelector("#progress");
    if (!loadBar) return;
    setTimeout(() => {
      loadBar.style.width = "100%";
    }, 10);
    setTimeout(() => {
      loadBar.remove();
    }, 1100);
  }
  showLoadBar(body, progress) {
    if (progress) return;
    const loadBar = document.createElement("div");
    loadBar.innerHTML = "<b></b><i></i>";
    loadBar.id = "progress";
    body.append(loadBar);
    setTimeout(() => {
      loadBar.style.width = "75%";
    }, 10);
  }
}

export default TopLoadBar;
