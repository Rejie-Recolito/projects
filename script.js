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
function renderPosts(posts, clear = true) {
  // Clear the container if the clear flag is true
  if (clear) {
    postsContainer.innerHTML = '';
  }

  // Loop through each post and render
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.setAttribute('data-id', post.id);
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn btn btn-secondary">Delete</button>
    `;

    // Attach event listener for the Edit button
    const editButton = postElement.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
      openEditModal(post.id, post.title, post.body);
    });

    // Attach event listener for the Delete button
    const deleteButton = postElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
      deletePost(post.id);
    });

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
function openEditModal(postId) {
  // Get the post's current title and body from the DOM
  const postElement = postsContainer.querySelector(`[data-id="${postId}"]`);
  const title = postElement.querySelector('h3').textContent;
  const body = postElement.querySelector('p').textContent;

  // Populate the modal with the current values
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-body').value = body;

  // Set the current edit ID
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

    // Append the new post to the UI
    renderPosts([newPost], false);

    // Clear the form and close the modal
    document.getElementById('add-title').value = '';
    document.getElementById('add-body').value = '';
    addPostModal.classList.add('hidden');
  }
});


// Handle Edit Form Submit
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get updated values from the modal
  const title = document.getElementById('edit-title').value;
  const body = document.getElementById('edit-body').value;

  // Send a PUT request to update the post
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: currentEditId, title, body }),
  });

  if (response.ok) {
    const updatedPost = await response.json();

    // Find the corresponding post element in the DOM
    const postElement = postsContainer.querySelector(`[data-id="${currentEditId}"]`);
    if (postElement) {
      // Update the post's title and body in the DOM
      postElement.querySelector('h3').textContent = updatedPost.title;
      postElement.querySelector('p').textContent = updatedPost.body;
    }

    // Hide the modal after the update
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
