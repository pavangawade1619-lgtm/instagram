
// ==============================
// 1. SELECT ELEMENTS
// ==============================

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalButton = document.getElementById("closeModal");

const originalTitles = {
  stories: "Your circle",
  feed: "Discover your feed"
};

// ==============================
// 2. MODAL FUNCTIONS
// ==============================

function openModal(title, content) {
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const firstInput = modalBody.querySelector("input, textarea");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeModalButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// ==============================
// 3. LIKE BUTTONS
// ==============================

function setLike(button, liked) {
  const post = button.closest(".post-card");
  const countElement = post.querySelector(".like-count");

  const currentCount = Number(
    countElement.textContent.replace(/,/g, "")
  );

  if (liked && !button.classList.contains("liked")) {
    countElement.textContent = (currentCount + 1).toLocaleString("en-US");
  } else if (!liked && button.classList.contains("liked")) {
    countElement.textContent = Math.max(0, currentCount - 1)
      .toLocaleString("en-US");
  }

  button.classList.toggle("liked", liked);
  button.textContent = liked ? "♥" : "♡";
  button.setAttribute("aria-pressed", String(liked));
}

document.querySelectorAll(".like-button").forEach((button) => {
  button.addEventListener("click", () => {
    setLike(button, !button.classList.contains("liked"));
  });
});

// Double-click a post image to like it.
document.querySelectorAll(".post-image-wrap").forEach((wrapper) => {
  wrapper.addEventListener("dblclick", () => {
    const likeButton = wrapper.closest(".post-card")
      .querySelector(".like-button");

    setLike(likeButton, true);

    const overlay = wrapper.querySelector(".like-overlay");
    overlay.classList.remove("pop");

    // Restart the animation.
    void overlay.offsetWidth;
    overlay.classList.add("pop");
  });
});

// ==============================
// 4. SAVE / BOOKMARK POSTS
// ==============================

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const saved = !button.classList.contains("saved");

    button.classList.toggle("saved", saved);
    button.textContent = saved ? "▣" : "♧";
    button.setAttribute("aria-pressed", String(saved));

    showToast(saved ? "Post saved ✨" : "Post removed from saved");
  });
});

// ==============================
// 5. FOLLOW BUTTONS
// ==============================

document.querySelectorAll(".follow-button").forEach((button) => {
  button.addEventListener("click", () => {
    const following = !button.classList.contains("following");

    button.classList.toggle("following", following);
    button.textContent = following ? "Following" : "Follow";

    showToast(
      following ? "You're now following this creator!" :
      "You unfollowed this creator."
    );
  });
});

// ==============================
// 6. COMMENTS
// ==============================

document.querySelectorAll(".comment-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector("input");
    const comment = input.value.trim();

    if (!comment) {
      input.focus();
      return;
    }

    const commentLine = document.createElement("p");
    commentLine.className = "caption";
    commentLine.style.marginTop = "8px";

    const username = document.createElement("strong");
    username.textContent = "you ";

    const text = document.createTextNode(comment);

    commentLine.append(username, text);
    form.before(commentLine);

    input.value = "";
    showToast("Comment added!");
  });
});

// ==============================
// 7. STORY PREVIEWS
// ==============================

const storyImages = {
  "Sophia":
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
  "Alex":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
  "Mia":
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
  "Ryan":
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
  "Olivia":
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600"
};

document.querySelectorAll(".story-item").forEach((story) => {
  story.addEventListener("click", () => {
    const name = story.dataset.story;

    if (name === "Your story") {
      openCreateModal();
      return;
    }

    const image = storyImages[name];

    openModal(
      `${name}'s story`,
      `
        <img class="modal-story-image" src="${image}" alt="${name}'s story">
        <p class="modal-copy">Enjoy the little moments ✨</p>
        <button class="modal-primary" id="nextStory" style="width:100%;margin-top:15px">
          Back to feed
        </button>
      `
    );

    document.getElementById("nextStory")
      .addEventListener("click", closeModal);
  });
});

document.getElementById("viewStories").addEventListener("click", () => {
  const stories = Object.entries(storyImages)
    .map(([name, image]) => `
      <div class="modal-story-row">
        <img src="${image}" alt="${name}">
        <span>${name}</span>
      </div>
    `).join("");

  openModal(
    "Your circle",
    `<div class="modal-story-list">${stories}</div>`
  );
});

// ==============================
// 8. CREATE POST MODAL
// ==============================

function openCreateModal() {
  openModal(
    "Create a moment ✨",
    `
      <p class="modal-copy" style="margin-bottom:16px">
        Share a photo and a caption with your community.
      </p>

      <form class="modal-form" id="createPostForm">
        <input
          type="text"
          id="newPostUser"
          placeholder="Your username"
          value="your.vibe"
          required
          maxlength="30"
        >

        <input
          type="url"
          id="newPostImage"
          placeholder="Image URL (https://...)"
          required
        >

        <img
          id="newPostPreview"
          class="modal-preview"
          alt="Image preview"
          hidden
        >

        <textarea
          id="newPostCaption"
          rows="3"
          maxlength="500"
          placeholder="Write a caption..."
          required
        ></textarea>

        <button type="submit">Share post</button>
      </form>

      <p id="createPostMessage" class="modal-message" role="status"></p>
    `
  );

  const form = document.getElementById("createPostForm");
  const imageInput = document.getElementById("newPostImage");
  const preview = document.getElementById("newPostPreview");

  imageInput.addEventListener("input", () => {
    const url = imageInput.value.trim();

    preview.hidden = true;

    if (!url) return;

    try {
      const parsed = new URL(url);

      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return;
      }

      preview.onload = () => {
        preview.hidden = false;
      };

      preview.onerror = () => {
        preview.hidden = true;
      };

      preview.src = parsed.href;
    } catch {
      preview.hidden = true;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("newPostUser")
      .value.trim().replace(/^@+/, "");

    const imageURL = document.getElementById("newPostImage")
      .value.trim();

    const caption = document.getElementById("newPostCaption")
      .value.trim();

    let parsedURL;

    try {
      parsedURL = new URL(imageURL);
    } catch {
      document.getElementById("createPostMessage").textContent =
        "Please enter a valid image URL.";
      return;
    }

    if (
      !username ||
      !caption ||
      !["http:", "https:"].includes(parsedURL.protocol)
    ) {
      document.getElementById("createPostMessage").textContent =
        "Please complete all fields with valid details.";
      return;
    }

    const post = createPostElement(username, parsedURL.href, caption);
    const feed = document.querySelector(".feed-section");

    feed.appendChild(post);
    closeModal();

    post.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Your post was added to the feed!");
  });
}

function createPostElement(username, imageURL, caption) {
  const article = document.createElement("article");
  article.className = "post-card";

  // Build elements with DOM APIs instead of inserting user content as HTML.
  const header = document.createElement("div");
  header.className = "post-header";

  const avatar = document.createElement("img");
  avatar.className = "post-avatar";
  avatar.src =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";
  avatar.alt = "Profile";

  const user = document.createElement("div");
  user.className = "post-user";

  const strong = document.createElement("strong");
  strong.textContent = username;

  const time = document.createElement("span");
  time.textContent = "Just now";

  user.append(strong, time);

  const more = document.createElement("button");
  more.className = "more-button";
  more.textContent = "•••";
  more.setAttribute("aria-label", "More options");

  header.append(avatar, user, more);

  const imageWrap = document.createElement("div");
  imageWrap.className = "post-image-wrap";

  const image = document.createElement("img");
  image.className = "post-image";
  image.src = imageURL;
  image.alt = "Community post";
  image.onerror = () => {
    image.alt = "Image unavailable";
  };

  const overlay = document.createElement("span");
  overlay.className = "like-overlay";
  overlay.textContent = "♥";

  imageWrap.append(image, overlay);

  const actions = document.createElement("div");
  actions.className = "post-actions";

  const group = document.createElement("div");
  group.className = "action-group";

  const like = document.createElement("button");
  like.className = "action-button like-button";
  like.textContent = "♡";
  like.setAttribute("aria-label", "Like post");
  like.setAttribute("aria-pressed", "false");

  like.addEventListener("click", () => {
    setLike(like, !like.classList.contains("liked"));
  });

  const commentButton = document.createElement("button");
  commentButton.className = "action-button comment-button";
  commentButton.textContent = "◯";
  commentButton.setAttribute("aria-label", "Comment on post");
  commentButton.addEventListener("click", () => {
    article.querySelector(".comment-form input").focus();
  });

  const share = document.createElement("button");
  share.className = "action-button share-button";
  share.textContent = "➤";
  share.setAttribute("aria-label", "Share post");
  share.addEventListener("click", () => sharePost(imageURL));

  const save = document.createElement("button");
  save.className = "action-button save-button";
  save.textContent = "♧";
  save.setAttribute("aria-label", "Save post");
  save.setAttribute("aria-pressed", "false");
  save.addEventListener("click", () => {
    const saved = !save.classList.contains("saved");
    save.classList.toggle("saved", saved);
    save.textContent = saved ? "▣" : "♧";
    save.setAttribute("aria-pressed", String(saved));
    showToast(saved ? "Post saved ✨" : "Post removed from saved");
  });

  group.append(like, commentButton, share);
  actions.append(group, save);

  const details = document.createElement("div");
  details.className = "post-details";

  const likes = document.createElement("p");
  likes.className = "likes-count";

  const likesStrong = document.createElement("strong");
  const count = document.createElement("span");
  count.className = "like-count";
  count.textContent = "0";
  likesStrong.append(count, document.createTextNode(" likes"));
  likes.append(likesStrong);

  const captionElement = document.createElement("p");
  captionElement.className = "caption";

  const captionUser = document.createElement("strong");
  captionUser.textContent = username + " ";

  captionElement.append(captionUser, document.createTextNode(caption));

  const commentLink = document.createElement("button");
  commentLink.className = "comments-link";
  commentLink.textContent = "View all comments";

  const form = document.createElement("form");
  form.className = "comment-form";

  const input = document.createElement("input");
  input.placeholder = "Add a comment...";
  input.setAttribute("aria-label", "Add a comment");

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Post";

  form.append(input, submit);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = input.value.trim();
    if (!value) return;

    const newComment = document.createElement("p");
    newComment.className = "caption";

    const commentUser = document.createElement("strong");
    commentUser.textContent = "you ";

    newComment.append(commentUser, document.createTextNode(value));
    form.before(newComment);
    input.value = "";
    showToast("Comment added!");
  });

  details.append(likes, captionElement, commentLink, form);
  article.append(header, imageWrap, actions, details);

  imageWrap.addEventListener("dblclick", () => {
    setLike(like, true);
    overlay.classList.remove("pop");
    void overlay.offsetWidth;
    overlay.classList.add("pop");
  });

  return article;
}

document.getElementById("createLink").addEventListener("click", (event) => {
  event.preventDefault();
  openCreateModal();
});

document.getElementById("topCreate").addEventListener("click", openCreateModal);

// ==============================
// 9. SHARE POSTS
// ==============================

async function sharePost(url) {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Check out this moment",
        url
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      showToast("Image link copied!");
    } else {
      openModal(
        "Share this moment",
        `
          <p class="modal-copy">Copy this image URL to share it:</p>
          <input
            id="shareURL"
            value="${url.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"
            readonly
            style="width:100%;padding:12px;margin-top:15px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:10px"
          >
          <button class="modal-primary" id="copyShareURL"
            style="width:100%;margin-top:12px">Select link</button>
        `
      );

      document.getElementById("copyShareURL").addEventListener("click", () => {
        const input = document.getElementById("shareURL");
        input.select();
        showToast("Press Ctrl+C to copy the link.");
      });
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showToast("Unable to share this link.");
    }
  }
}

document.querySelectorAll(".share-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.closest(".post-card").querySelector(".post-image");
    sharePost(image.src);
  });
});

// ==============================
// 10. THEME SWITCHER
// ==============================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const light = document.body.classList.contains("light-theme");
  themeToggle.textContent = light ? "☾" : "☼";
  themeToggle.setAttribute(
    "aria-label",
    light ? "Switch to dark theme" : "Switch to light theme"
  );
});

// ==============================
// 11. SEARCH
// ==============================

function openSearch() {
  openModal(
    "Find your vibe",
    `
      <form class="modal-form" id="searchForm">
        <input
          id="searchInput"
          type="search"
          placeholder="Search usernames or captions..."
          aria-label="Search posts"
          required
        >
        <button type="submit">Search feed</button>
      </form>
      <p class="modal-copy" style="margin-top:12px">
        Search the sample posts on this page.
      </p>
    `
  );

  document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const query = document.getElementById("searchInput")
      .value.trim().toLowerCase();

    const cards = [...document.querySelectorAll(".post-card")];

    let firstMatch = null;
    let matches = 0;

    cards.forEach((card) => {
      const found = card.textContent.toLowerCase().includes(query);
      card.style.display = found ? "" : "none";

      if (found) {
        matches++;
        if (!firstMatch) firstMatch = card;
      }
    });

    closeModal();

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    showToast(matches ? `${matches} matching post(s) found` : "No matching posts");
  });
}

document.getElementById("searchLink").addEventListener("click", (event) => {
  event.preventDefault();
  openSearch();
});

// ==============================
// 12. NOTIFICATIONS & SUGGESTIONS
// ==============================

document.getElementById("notificationsLink").addEventListener("click", (event) => {
  event.preventDefault();

  openModal(
    "Notifications ♡",
    `
      <p class="modal-copy">
        ✨ Welcome to InstaVibe!<br><br>
        💜 Discover inspiring creators.<br><br>
        🌸 Share moments with your community.<br><br>
        🔔 Your demo notifications will appear here.
      </p>
    `
  );
});

document.getElementById("seeAll").addEventListener("click", () => {
  openModal(
    "Discover creators",
    `
      <p class="modal-copy">
        Explore the suggested accounts on the right side of your feed.
        Tap Follow to update your demo following state.
      </p>
      <button class="modal-primary" id="backToSuggestions"
        style="width:100%;margin-top:18px">View suggestions</button>
    `
  );

  document.getElementById("backToSuggestions").addEventListener("click", () => {
    closeModal();
    document.querySelector(".suggestion-heading")
      .scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

// ==============================
// 13. SIMPLE TOAST NOTIFICATIONS
// ==============================

let toastTimer;

function showToast(message) {
  let toast = document.getElementById("toastMessage");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastMessage";

    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      bottom: "30px",
      transform: "translate(-50%, 15px)",
      background: "#272033",
      color: "#fff",
      border: "1px solid rgba(255,255,255,.15)",
      borderRadius: "12px",
      padding: "12px 18px",
      fontSize: "12px",
      zIndex: "200",
      opacity: "0",
      transition: "opacity .25s, transform .25s",
      boxShadow: "0 10px 35px rgba(0,0,0,.25)",
      maxWidth: "90vw",
      textAlign: "center"
    });

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translate(-50%, 0)";

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 15px)";
  }, 2400);
}

// ==============================
// 14. BASIC INITIALIZATION
// ==============================

console.log("InstaVibe loaded successfully ✨");
