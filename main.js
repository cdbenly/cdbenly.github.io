document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio initialized");
  loadMainConfig();
});

async function loadMainConfig() {
  try {
    const response = await fetch("main.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    console.log("Config loaded:", config);
    renderBlog(config);
  } catch (error) {
    console.error("Error loading main.json:", error);
    document.getElementById("main").innerHTML =
      `<div class="text-red-500 text-center">Failed to load content.</div>`;
  }
}

function renderBlog(config) {
  const container = document.getElementById("main");
  container.innerHTML = ""; // Clear loading state

  // Sort posts by date descending
  const posts = config.posts.sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Simple pagination logic (client-side for now, as per original json structure)
  const postsPerPage = config.number_of_posts_per_page || 5;
  // Get current page from query string ?page=X
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const displayedPosts = posts.slice(start, end);

  // Render Posts
  if (displayedPosts.length === 0) {
    container.innerHTML =
      '<div class="text-slate-500 text-center py-20">No posts found.</div>';
    return;
  }

  const postsHtml = displayedPosts
    .map(
      (post) => `
      <article class="relative group bg-slate-900/40 rounded-3xl p-8 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 mb-8 backdrop-blur-sm animate-fade-in-up">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <div class="flex-shrink-0 pt-1">
                  <div class="flex items-center space-x-3 text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <div class="w-1 h-12 bg-slate-800 rounded-full group-hover:bg-indigo-500 transition-all duration-500"></div>
                      <span class="font-mono text-sm tracking-wider uppercase">${post.date}</span>
                  </div>
              </div>
              <div class="flex-grow">
                  <h2 class="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">
                      <a href="${post.path}" class="text-white hover:text-indigo-300 transition-colors duration-200 block bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all group-hover:bg-[length:100%_2px]">
                          ${post.title}
                      </a>
                  </h2>
                  <div class="text-slate-400 leading-relaxed line-clamp-3">
                      Explore the details of this post...
                  </div>
                  <div class="mt-6 flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Read Article 
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
              </div>
          </div>
      </article>
  `,
    )
    .join("");

  container.innerHTML = postsHtml;

  // Render Pagination
  if (totalPages > 1) {
    let paginationHtml =
      '<div class="flex justify-center items-center space-x-2 mt-16"><span class="text-slate-500 text-xs uppercase tracking-widest mr-4 font-semibold">Pages</span><div class="flex space-x-2">';
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        paginationHtml += `<span class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 transition-all scale-110">${i}</span>`;
      } else {
        paginationHtml += `<a href="?page=${i}" class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all hover:scale-105 hover:shadow-lg">${i}</a>`;
      }
    }
    paginationHtml += "</div></div>";
    container.innerHTML += paginationHtml;
  }
}
