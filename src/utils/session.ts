function getTabSessionId() {
  const key = "tab_session_id";

  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID(); // generate once per tab
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

export { getTabSessionId };
