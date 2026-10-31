const WARNING = "Your current exam progress will be lost if you leave. Leave the exam?";
const GUARD_KEY = "gmatExamExitGuard";

export function guardExamExit() {
  let leaving = false;
  const url = window.location.href;
  if (!window.history.state?.[GUARD_KEY]) {
    window.history.pushState({ ...window.history.state, [GUARD_KEY]: true }, "", url);
  }

  function beforeUnload(event: BeforeUnloadEvent) {
    if (leaving) return;
    event.preventDefault();
    event.returnValue = "";
  }

  function click(event: MouseEvent) {
    if (leaving || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download") || link.href === window.location.href || link.getAttribute("href")?.startsWith("#")) return;
    if (window.confirm(WARNING)) leaving = true;
    else { event.preventDefault(); event.stopImmediatePropagation(); }
  }

  function popState(event: PopStateEvent) {
    if (leaving) return;
    event.stopImmediatePropagation();
    if (window.confirm(WARNING)) {
      leaving = true;
      window.history.back();
    } else {
      window.history.pushState({ ...window.history.state, [GUARD_KEY]: true }, "", url);
    }
  }

  window.addEventListener("beforeunload", beforeUnload);
  document.addEventListener("click", click, true);
  window.addEventListener("popstate", popState, true);
  return () => {
    window.removeEventListener("beforeunload", beforeUnload);
    document.removeEventListener("click", click, true);
    window.removeEventListener("popstate", popState, true);
  };
}
