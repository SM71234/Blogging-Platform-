// Utility to get blog posts from localStorage
function getPosts() {
  return JSON.parse(localStorage.getItem("blogPosts") || "[]");
}

// Utility to save blog posts to localStorage
function savePosts(posts) {
  localStorage.setItem("blogPosts", JSON.stringify(posts));
}

// Generate unique ID for each post
function generateId() {
  return Date.now().toString();
}

// Handle creating a blog post
if (document.getElementById("create-form")) {
  document.getElementById("create-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const tags = document.getElementById("tags").value.trim();

    if (title && content) {
      const posts = getPosts();
      posts.push({
        id: generateId(),
        title,
        content,
        tags,
      });
      savePosts(posts);
      window.location.href = "index.html";
    }
  });
}

// Load posts to homepage
if (document.getElementById("blog-list")) {
  const posts = getPosts();
  const container = document.getElementById("blog-list");

  if (posts.length === 0) {
    container.innerHTML = "<p>No blog posts yet. Click '+ New Post' to get started.</p>";
  } else {
    posts.reverse().forEach((post) => {
      const div = document.createElement("div");
      div.className = "blog-post";
      div.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p class="tags">#${post.tags.split(",").join(" #")}</p>
        <button onclick="editPost('${post.id}')">Edit</button>
        <button onclick="deletePost('${post.id}')">Delete</button>
      `;
      container.appendChild(div);
    });
  }
}

// Redirect to edit page with post ID
function editPost(id) {
  window.location.href = edit.html?id=${id};
}

// Delete a post
function deletePost(id) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  const posts = getPosts().filter(post => post.id !== id);
  savePosts(posts);
  location.reload(); // Refresh to show updated list
}

// Load post data into edit form
if (document.getElementById("edit-form")) {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);

  if (!post) {
    alert("Post not found!");
    window.location.href = "index.html";
  }

  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;
  document.getElementById("edit-tags").value = post.tags;

  document.getElementById("edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    post.title = document.getElementById("edit-title").value.trim();
    post.content = document.getElementById("edit-content").value.trim();
    post.tags = document.getElementById("edit-tags").value.trim();

    const updatedPosts = posts.map(p => (p.id === postId ? post : p));
    savePosts(updatedPosts);
    window.location.href = "index.html";
 });
}