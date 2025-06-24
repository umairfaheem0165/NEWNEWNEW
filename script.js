const repoForm = document.getElementById("repoForm");
const repoInput = document.getElementById("repoInput");
const repoInfo = document.getElementById("repoInfo");
const repoName = document.getElementById("repoName");
const repoDescription = document.getElementById("repoDescription");
const repoStars = document.getElementById("repoStars");
const repoForks = document.getElementById("repoForks");
const loadCommitsBtn = document.getElementById("loadCommitsBtn");
const commitsList = document.getElementById("commitsList");
const errorMsg = document.getElementById("errorMsg");

let currentRepo = "";

repoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const repo = repoInput.value.trim();
  if (!repo) return;

  errorMsg.classList.add("hidden");
  repoInfo.classList.add("hidden");
  commitsList.innerHTML = "";
  currentRepo = repo;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`);
    if (!response.ok) throw new Error("Repository not found");

    const data = await response.json();

    repoName.textContent = data.full_name;
    repoDescription.textContent = data.description || "No description provided.";
    repoStars.textContent = data.stargazers_count;
    repoForks.textContent = data.forks_count;
    repoInfo.classList.remove("hidden");
  } catch (error) {
    errorMsg.textContent = error.message;
    errorMsg.classList.remove("hidden");
  }
});

loadCommitsBtn.addEventListener("click", async () => {
  if (!currentRepo) return;

  commitsList.innerHTML = "";
  loadCommitsBtn.disabled = true;
  loadCommitsBtn.textContent = "Loading...";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${currentRepo}/commits?per_page=5`
    );
    if (!response.ok) throw new Error("Failed to load commits");

    const commits = await response.json();

    commits.forEach((commit) => {
      const li = document.createElement("li");
      li.textContent = `${commit.commit.author.name}: ${commit.commit.message}`;
      commitsList.appendChild(li);
    });
  } catch (error) {
    commitsList.innerHTML = `<li style="color: red;">${error.message}</li>`;
  } finally {
    loadCommitsBtn.disabled = false;
    loadCommitsBtn.textContent = "Load Latest Commits";
  }
});
