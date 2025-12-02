// blog.js - Fetch and submit community blog posts via Google Apps Script API
const API_URL = "https://script.google.com/macros/s/AKfycbyQmdJBr-bRHXxDj8OFvC6OHAfnw3RmuP3qhp7yjt9auMr5tZrtA0ybahXmONQ-EELUdA/exec";
const ADMIN_ID = "BKGUPTA5011";
const ADMIN_PASSWORD = "ARKbiz201@";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#blog-form");
  const nameInput = document.querySelector("#blog-name");
  const emailInput = document.querySelector("#blog-email");
  const subjectInput = document.querySelector("#blog-subject");
  const contentInput = document.querySelector("#blog-content");
  const messageBox = document.querySelector(".form-message");
  const blogList = document.querySelector("#blog-list");
  const adminForm = document.querySelector("#admin-form");
  const adminIdInput = document.querySelector("#admin-id");
  const adminPassInput = document.querySelector("#admin-pass");
  const adminPanel = document.querySelector("#admin-panel");
  const adminPosts = document.querySelector("#admin-posts");
  const adminMessage = document.querySelector(".admin-message");
  const refreshAdminBtn = document.querySelector("#refresh-admin-posts");

  let isAdmin = false;

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

  const setAdminMessage = (text, type = "info") => {
    if (!adminMessage) return;
    adminMessage.textContent = text;
    adminMessage.className = `form-message admin-message ${type}`;
  };

  const renderAdminPosts = posts => {
    if (!adminPosts) return;
    if (!posts || !posts.length) {
      adminPosts.innerHTML = "<p>No submissions yet.</p>";
      return;
    }
    const rows = posts
      .map(
        p => `<tr>
          <td>${p.row || ""}</td>
          <td>${p.dateTime ? new Date(p.dateTime).toLocaleString() : ""}</td>
          <td>${p.name || ""}<br><small>${p.email || ""}</small></td>
          <td><strong>${p.subject || ""}</strong><br><div>${p.content || ""}</div></td>
          <td class="admin-badge">${p.approved || ""}</td>
          <td>
            <div class="admin-controls">
              <button class="admin-btn approve" data-row="${p.row}" data-status="Yes">Approve</button>
              <button class="admin-btn reject" data-row="${p.row}" data-status="No">Reject</button>
            </div>
          </td>
        </tr>`
      )
      .join("");
    adminPosts.innerHTML = `<table>
      <thead>
        <tr><th>Row</th><th>Date/Time</th><th>User</th><th>Post</th><th>Approved?</th><th>Action</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
  };

  const loadAdminPosts = async () => {
    if (!isAdmin || !adminPosts) return;
    adminPosts.innerHTML = "<p>Loading all submissions...</p>";
    try {
      const url = `${API_URL}?adminId=${encodeURIComponent(ADMIN_ID)}&adminPass=${encodeURIComponent(ADMIN_PASSWORD)}`;
      const res = await fetch(url, { method: "GET", mode: "cors", cache: "no-cache" });
      if (!res.ok) throw new Error(`API error (${res.status})`);
      const data = await res.json();
      if (data.status !== "success") throw new Error("API returned an error status.");
      renderAdminPosts(data.posts || []);
    } catch (err) {
      adminPosts.innerHTML = `<p class="form-message error">Could not load submissions (network/CORS). Please try again.</p>`;
      console.error(err);
    }
  };

  const updateApproval = async (row, approved) => {
    if (!row) return;
    setAdminMessage("Updating...", "info");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({
          action: "approve",
          row,
          approved,
          adminId: ADMIN_ID,
          adminPass: ADMIN_PASSWORD
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }
      setAdminMessage(`Row ${row} set to ${approved}.`, "success");
      await loadAdminPosts();
    } catch (err) {
      setAdminMessage(`Error: ${err.message || "Could not update."}`, "error");
      console.error(err);
    }
  };

  if (adminForm) {
    adminForm.addEventListener("submit", e => {
      e.preventDefault();
      const id = adminIdInput?.value.trim();
      const pass = adminPassInput?.value.trim();
      if (id === ADMIN_ID && pass === ADMIN_PASSWORD) {
        isAdmin = true;
        setAdminMessage("Logged in. Loading submissions...", "success");
        adminPanel?.classList.remove("hidden");
        loadAdminPosts();
      } else {
        setAdminMessage("Invalid admin credentials.", "error");
      }
    });
  }

  if (refreshAdminBtn) {
    refreshAdminBtn.addEventListener("click", e => {
      e.preventDefault();
      loadAdminPosts();
    });
  }

  if (adminPosts) {
    adminPosts.addEventListener("click", e => {
      const btn = e.target.closest(".admin-btn");
      if (!btn) return;
      const row = btn.getAttribute("data-row");
      const status = btn.getAttribute("data-status");
      updateApproval(row, status);
    });
  }

  loadPosts();
});
