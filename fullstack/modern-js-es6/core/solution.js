/*
 * Project: Async Data
 * Fetch and Display API Posts
 *
 * Concepts demonstrated:
 * 1. async/await
 * 2. Fetch API
 * 3. HTTP response handling
 * 4. JSON processing
 * 5. try/catch/finally
 * 6. DOM manipulation
 */

// === FILE: solution.js ===

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";

// Create the application interface
const app = document.createElement("div");
const heading = document.createElement("h1");
const fetchButton = document.createElement("button");
const statusMessage = document.createElement("p");
const postsContainer = document.createElement("div");

heading.textContent = "Latest Posts";
fetchButton.textContent = "Fetch Posts";

app.append(heading, fetchButton, statusMessage, postsContainer);
document.body.appendChild(app);

// Display fetched posts
const displayPosts = (posts) => {
    postsContainer.replaceChildren();

    posts.forEach((post) => {
        const postElement = document.createElement("article");
        const title = document.createElement("h2");
        const body = document.createElement("p");

        title.textContent = post.title;
        body.textContent = post.body;

        postElement.append(title, body);
        postsContainer.appendChild(postElement);
    });
};

// Fetch posts using async/await
const fetchPosts = async () => {
    statusMessage.textContent = "Loading posts...";
    fetchButton.disabled = true;
    postsContainer.replaceChildren();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error("Invalid API response.");
        }

        displayPosts(posts);
        statusMessage.textContent = `Successfully loaded ${posts.length} posts.`;

    } catch (error) {
        statusMessage.textContent = `Failed to load posts: ${error.message}`;

    } finally {
        fetchButton.disabled = false;
    }
};

// Fetch posts when the button is clicked
fetchButton.addEventListener("click", fetchPosts);

// Load posts initially
fetchPosts();

/*
 * How to run:
 * 1. Save this file as solution.js.
 * 2. Create an HTML file.
 * 3. Include <script src="solution.js"></script> in the HTML body.
 * 4. Open the HTML file through a local development server.
 */