const STORAGE_KEY = "subreddits";

function getStorage() {
  return browser.storage.local.get().then(x => x[STORAGE_KEY]);
}

function setStorage(newValue) { 
  browser.storage.local.set({ [STORAGE_KEY]: newValue });
}

const appendSubreddit = async (name) => {
  const subreddits = await getStorage();
  const updatedSubreddits = [...subreddits, name];
  setStorage(updatedSubreddits);
}

const removeSubreddit = async (name) => {
  const subreddits = await getStorage();
  const updatedSubreddits = subreddits.filter(x => x !== name);
  setStorage(updatedSubreddits);
}

const checkSubredditExists = async (name) => {
  const subreddits = await getStorage();  
  return subreddits.includes(name);
}

const addListElement = (name) => {
  const ul = document.querySelector("#blocked-subreddit-list");
  const li = document.createElement('li');
  const span = document.createElement('span');
  const button = document.createElement('span');
  span.innerText = name;
  button.className = "remove-subreddit-button"
  button.innerText = 'x';
  ul.appendChild(li);
  li.appendChild(span)
  li.appendChild(button)
  button.addEventListener('click', () => {
    removeSubreddit(name);
    removeListElement(li)
  });
}

const removeListElement = (li) => {
  li.parentElement.removeChild(li);
}

const handleSubmit = async (evt) => {
  evt.preventDefault();
  const input = document.querySelector('#subreddit-input');
  const text = input.value.trim().toLowerCase(); 
  if (text) {
    const exists = await checkSubredditExists(text)
    const hasSpace = /\s/.test(text);
    if (!exists && !hasSpace) {
      addListElement(text);
      appendSubreddit(text);
    }
  }
  input.value = "";
}

const load = async () => {
  let subreddits = await getStorage();
  if (!Array.isArray(subreddits)) {
    subreddits = ['all'];
    setStorage(subreddits);
  }
  subreddits.forEach(addListElement);

  document.querySelector("#input-form").addEventListener('submit', handleSubmit);
}

load();