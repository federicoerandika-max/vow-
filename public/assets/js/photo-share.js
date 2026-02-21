function openInstagram() {
  const instagramApp = "instagram://camera";
  const instagramWeb = "https://www.instagram.com/";

  if (/iPhone|iPad|iPod|Android/.test(navigator.userAgent)) {
    // prova ad aprire l'app
    window.location.href = instagramApp;
  } else {
    // fallback al web se non installata
      setTimeout(() => {
        window.open(instagramWeb, "_blank");
      }, 800);
  }
  
}