const blockedSubreddits = ['all'];

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

// eg. "/r/worldnews/" -> "worldnews" 
function getSubredditName(pathname) {
  return pathname.replace('/r/', '').slice(0, -1)
}

function main() {
  const { pathname } = window.location;

  // is homepage or blocked subreddit
  if(/^\/?$/.test(pathname) || (
    pathname.startsWith('/r/') && 
    pathname.endsWith('/') &&
    blockedSubreddits.includes(getSubredditName(pathname))
  )) {
    removeContent();
  } else {
    observer.disconnect();
  }
}