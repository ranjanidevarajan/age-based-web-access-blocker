const badWords = [
  "suicide", 
  "self harm", 
  "self%20harm", 
  "self+harm", 
  "porn", "xxx", "adult", "nsfw", 
  "18+", "erotic", "nude", "hot video", "dark thoughts", "suicidal thoughts"
];


badWords.forEach((word) => {
  if (window.location.href.toLowerCase().includes(word)) {
    console.log("⚠️ Sensitive keyword detected:", word);
    alert("Sensitive content detected. Webcam age check triggered.");

    const video = document.createElement("video");
    video.setAttribute("autoplay", true);
    video.style.position = "fixed";
    video.style.top = "10px";
    video.style.left = "10px";
    video.style.zIndex = "9999";
    video.style.width = "320px";
    video.style.height = "240px";
    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;

        setTimeout(() => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL("image/jpeg");

          stream.getTracks().forEach(track => track.stop());
          video.remove();

          fetch("http://127.0.0.1:5000/verify-age", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: imageData })
          })
            .then(res => res.json())
            .then(data => {
              if (data.status === "no_face") {
                alert("❌ Face not clear. Please try again.");
              } else if (data.age < 18) {
                alert("Access denied. Age detected below 18.");
                window.location.href = "https://www.google.com";
              } else {
                console.log("✅ Age approved:", data.age);
              }
            })
            .catch(err => {
              console.error("Error verifying age:", err);
              alert("Server error: could not verify age.");
            });

        }, 3000);
      })
      .catch(err => {
        console.error("Webcam access denied:", err);
        alert("Please allow webcam access to proceed.");
      });
  }
});
