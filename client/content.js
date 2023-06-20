function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

waitForElm(".css-1dbjc4n.r-1awozwy.r-18u37iz.r-1s2bzr4").then((el) => {
  const filterBtn = new Image();
  filterBtn.src = "https://cdn-icons-png.flaticon.com/512/9584/9584673.png";
  filterBtn.width = 17;
  filterBtn.height = 17;
  filterBtn.style.cursor = "pointer";
  el.appendChild(filterBtn);

  filterBtn.addEventListener("click", () => {
    const text =
      document.querySelector("[data-text]").textContent != ""
        ? document.querySelector("[data-text]").textContent
        : "Empty";
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: new URLSearchParams({
        text: text,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((res) => showModal(res.tweet, res.result))
      .catch((err) => console.log(err));
  });
});

chrome.runtime.onMessage.addListener((req, sender, sendRespon) => {
  if (req.type === "popup-modal" && req.action === "getSelectedElement") {
    const account = getAccountName(
      ".css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0"
    );
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
      .then((res) => showModal(res.tweet, res.result, account, true))
      .catch((err) => console.log(err));
  }
});

const showModal = (
  tweet = "Nothing!!!",
  cat = "Nothing!!!",
  account = "Nobody!!!",
  isExist = false
) => {
  const modal = document.createElement("div");
  const modalBody = document.createElement("div");
  const tweetText = document.createElement("p");
  const btnClose = document.createElement("button");
  const classTweet = document.createElement("h3");
  const accountName = document.createElement("h2");

  modal.className = "modal";
  modalBody.className = "modal-body";
  accountName.innerText = `Dari: ${account}`;
  accountName.className = "account-name";
  tweetText.innerText = tweet;
  tweetText.className = "tweet-text";
  classTweet.innerText = cat;
  classTweet.className = "class-tweet";
  modal.appendChild(modalBody);
  if (isExist) modalBody.appendChild(accountName);
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

const getAccountName = (el) => {
  var selectedElement = window.getSelection().anchorNode.parentElement;
  var topLevelParent = selectedElement.parentNode;
  for (var i = 0; i < 5; i++) {
    topLevelParent = topLevelParent.parentNode;
  }

  const cardHeader = topLevelParent.querySelectorAll(el);
  return `${cardHeader[0].innerText}(${cardHeader[3].innerText})`;
};
