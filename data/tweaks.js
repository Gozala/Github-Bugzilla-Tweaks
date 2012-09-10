var BGZ_URL = 'https://bugzilla.mozilla.org/show_bug.cgi?id=';
var list = document.getElementsByClassName("js-hard-tabs smalltabs")[0];

if (list) {
  var bug = getBugNumber(document.title);
  if (bug) linkify();
  else {
    // Some projects use a modified gitflow process and use branch names
    // of the format "bug/nnnn-bug-description", so see if we can infer the
    // bug number from the branch name.
    var branchSpan = document.getElementsByClassName("commit-ref from")[0];
    var branchMatch = branchSpan.textContent.match(/^bug\/([0-9]{6})/);
    if (branchMatch) {
      bug = branchMatch[1];
    }
  }
  console.log("BUG #: " + bug);
  var li = document.createElement("li");

  if (bug)
    li.innerHTML = "<a href='#'>Attach to Bug " + bug + "</a>";
  else
    li.innerHTML = "<a href='#'>Attach to a New Bug</a>";

  li.addEventListener("click", function() {
    send(bug, document.location.toString());
  }, false);

  list.appendChild(li);
}

function send(bugNumber, pullRequestURL) {
  postMessage({bug: bugNumber, url: pullRequestURL});
}

// Search for a bug number in a string starting with: "bug ######"
function getBugNumber(str) {
  // Normalize string
  var parts = String(str).toLowerCase().
                          // Split into parts.
                          split(/\s+|\-+/g).
                          // Remove empty parts.
                          filter(function(part) { return !!part; });
  // Index of a bug number argument.
  var index = parts.indexOf("bug") + 1;
  // If bug is followed by a bug number return it otherwise `null`.
  return /^[0-9]{6}/.test(parts[index]) ? parts[index].substr(0, 6) : null;
}

// Converts 'bug ######' string in pull request title to a link to that
// bug.
function linkify() {
  var title = document.querySelector('.discussion-topic-title');
  if (title) {
    title.innerHTML =
    title.innerHTML.
          replace(/(bug\s*([0-9]{6}))/i, '<a href="' + BGZ_URL + '$2">$1</a>');
  }
}
