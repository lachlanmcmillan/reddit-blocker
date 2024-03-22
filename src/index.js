const STORAGE_KEY = 'subreddits';
const DEFAULT_CONFIG = ['all'];

async function getStorage() { 
  const config = await browser.storage.local.get().then(x => x[STORAGE_KEY])
  if (!config) {
    initStorage();
    return DEFAULT_CONFIG;
  } else {
    return config;
  }
}

function initStorage() {
  browser.storage.local.set({ [STORAGE_KEY]: DEFAULT_CONFIG });
}


// This script runs before the page HTML DOM is loaded, so there is no head 
// or body yet. Use the MutationObserver to execute the main function when
// the DOM changes.
const observer = new MutationObserver(main);
observer.observe(document, { childList: true, subtree:true });

function removeContent() {
  // old.reddit.com uses the role attribute, www.reddit.com uses the <main> element
  const main = document.querySelector('[role=main]') || document.querySelector('main');
  if (main) {
    const parent = main.parentElement;
    parent.removeChild(main);

    // the carousel like element at the bottom of www.reddit.com
    const masthead = document.querySelector('.masthead');
    masthead?.parentElement?.removeChild(masthead);

    const rSidebarContainer = document.querySelector('#right-sidebar-container');
    rSidebarContainer?.parentElement?.removeChild(rSidebarContainer);

    observer.disconnect();
  }
}

// eg. "/r/WorldNews/new" -> "worldnews" 
function getSubredditName(pathname) {
  return /\/r\/(\w+)\//.exec(pathname)?.[1]?.toLowerCase();
}

function main() {
  const pathname = window.location.pathname.toLowerCase();

  getStorage().then(blockedSubreddits => {
    console.log({ blockedSubreddits, subredditName: getSubredditName(pathname)});
    
    // is homepage or blocked subreddit
    if(pathname === '/' ||
      pathname === '/top/' || 
      pathname === '/new/' || 
      pathname === '/controversial/' ||
      pathname === '/rising/' ||
      pathname === '/wiki/' ||
      (
        pathname.startsWith('/r/') && 
        pathname.endsWith('/') &&
        blockedSubreddits.includes(getSubredditName(pathname))
      )
    ) {
      removeContent();
    } else {
      observer.disconnect();
    }
  })
}