chrome.runtime.onMessage.addListener((req, sender, sendRespon) => {
  if (req.type === "popup-modal") {
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: new URLSearchParams({
        text: req.value,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((res) => showModal(res.tweet, res.result))
      .catch((err) => console.log(err));
  }
});

const showModal = (tweet, cat) => {
  const modal = document.createElement("div");
  const modalBody = document.createElement("div");
  const tweetText = document.createElement("p");
  const btnClose = document.createElement("button");
  const classTweet = document.createElement("h3");

  modal.className = "modal";
  modalBody.className = "modal-body";
  tweetText.innerText = tweet;
  tweetText.className = "tweet-text";
  classTweet.innerText = cat;
  classTweet.className = "class-tweet";
  modal.appendChild(modalBody);
  modalBody.appendChild(tweetText);
  modalBody.appendChild(classTweet);
  btnClose.innerText = "Close";
  btnClose.className = "btn-close";
  modalBody.appendChild(btnClose);

  document.body.appendChild(modal);

  btnClose.addEventListener("click", () => {
    document.body.removeChild(modal);
  });
};
