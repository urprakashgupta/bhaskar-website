// blog.js - Fetch and submit community blog posts via Google Apps Script API
const API_URL = "https://script.google.com/macros/s/AKfycbyjoPoOuT2ULhFzOVO82LzXlsbkNGOdUS9iTve-nn5Pq6Y8BHzC4hO4XzBSErZw0wl-5w/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#blog-form");
  const nameInput = document.querySelector("#blog-name");
  const emailInput = document.querySelector("#blog-email");
  const subjectInput = document.querySelector("#blog-subject");
  const contentInput = document.querySelector("#blog-content");
  const messageBox = document.querySelector(".form-message");
  const blogList = document.querySelector("#blog-list");

  const setMessage = (text, type = "info") => {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `form-message ${type}`;
  };

  const renderPosts = posts => {
    if (!blogList) return;
    blogList.innerHTML = "";
    if (!posts || !posts.length) {
      const empty = document.createElement("p");
      empty.textContent = "No community blogs approved yet.";
      blogList.appendChild(empty);
      return;
    }

    posts.forEach(post => {
      const card = document.createElement("article");
      card.className = "blog-card";

      const title = document.createElement("h3");
      title.className = "blog-title";
      title.textContent = post.subject || "Untitled";

      const meta = document.createElement("p");
      meta.className = "blog-meta";
      const date = post.dateTime ? new Date(post.dateTime).toLocaleDateString() : "Unknown date";
      meta.textContent = `Posted by ${post.name || "Anonymous"} on ${date}`;

      const body = document.createElement("p");
      body.className = "blog-content";
      body.textContent = post.content || "";

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(body);
      blogList.appendChild(card);
    });
  };

  const loadPosts = async () => {
    if (blogList) {
      blogList.innerHTML = "<p>Loading posts...</p>";
    }
    try {
      const res = await fetch(API_URL, { method: "GET", mode: "cors", cache: "no-cache" });
      if (!res.ok) throw new Error(`API error (${res.status})`);
      const data = await res.json();
      if (data.status !== "success") throw new Error("API returned an error status.");
      renderPosts(data.posts || []);
    } catch (err) {
      if (blogList) {
        blogList.innerHTML = `<p class="form-message error">Could not load blogs (network/CORS). Please try again or check API deployment.</p>`;
      }
      console.error(err);
    }
  };

  const handleBlogSubmit = async event => {
    event.preventDefault();
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const subject = subjectInput?.value.trim();
    const content = contentInput?.value.trim();

    if (!name || !email || !subject || !content) {
      setMessage("Please fill in all fields before submitting.", "error");
      return;
    }

    const payload = { name, email, subject, content };
    setMessage("Submitting your blog...", "info");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      setMessage("Your blog has been submitted and is pending approval.", "success");
      if (form) form.reset();
    } catch (err) {
      setMessage(`Error: ${err.message || "Something went wrong."}`, "error");
      console.error(err);
    }
  };

  if (form) {
    form.addEventListener("submit", handleBlogSubmit);
  }

  loadPosts();
});
