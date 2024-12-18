const postsContainer = document.getElementById('posts-container');
const addPostModal = document.getElementById('add-post-modal');
const editModal = document.getElementById('edit-modal');
const addPostForm = document.getElementById('add-post-form');
const editForm = document.getElementById('edit-form');
let currentEditId;

// Fetch posts
async function fetchPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await response.json();
  renderPosts(posts.slice(0, 10)); // Limit to 10 posts
}

// Render posts
function renderPosts(posts) {
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.setAttribute('data-id', post.id); // Attach the post ID
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <button onclick="openEditModal(${post.id}, '${encodeURIComponent(post.title)}', '${encodeURIComponent(post.body)}')">Edit</button>
      <button onclick="deletePost(${post.id})" class="btn btn-secondary">Delete</button>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Open Add Post Modal
document.getElementById('add-post-btn').addEventListener('click', () => {
  addPostModal.classList.remove('hidden');
});

// Close Add Post Modal
document.getElementById('close-add-modal').addEventListener('click', () => {
  addPostModal.classList.add('hidden');
});

// Open Edit Modal
function openEditModal(postId, postTitle, postBody) {
    // Reset the modal inputs to avoid previously entered values.
    document.getElementById('edit-title').value = ''; 
    document.getElementById('edit-body').value = '';
  
    // Store the current post ID in a variable for later use when submitting the form
    currentEditId = postId;
  
    // Show the modal
    editModal.classList.remove('hidden');
  }  

// Close Edit Modal
document.getElementById('close-modal').addEventListener('click', () => {
  editModal.classList.add('hidden');
});

// Handle Add Post Form Submit
addPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('add-title').value;
  const body = document.getElementById('add-body').value;

  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });

  if (response.ok) {
    const newPost = await response.json();
    renderPosts([newPost, ...JSON.parse(localStorage.getItem('posts') || '[]')]); // Add new post at the top
    addPostModal.classList.add('hidden');
  }
});

// Handle Edit Form Submit
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('edit-title').value;
  const body = document.getElementById('edit-body').value;

  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: currentEditId, title, body }),
  });

  if (response.ok) {
    const updatedPost = await response.json();
    const postElement = postsContainer.querySelector(`[data-id="${currentEditId}"]`);
    postElement.querySelector('h3').textContent = updatedPost.title;
    postElement.querySelector('p').textContent = updatedPost.body;
    editModal.classList.add('hidden');
  }
});

// Delete Post
async function deletePost(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    // Remove the post from the DOM
    const postElement = postsContainer.querySelector(`[data-id="${id}"]`);
    if (postElement) {
      postElement.remove();
    }
    console.log(`Post with ID ${id} deleted.`);
  } else {
    console.error(`Failed to delete post with ID ${id}`);
  }
}

// Initialize
fetchPosts();
