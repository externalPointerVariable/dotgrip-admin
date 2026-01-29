import { useState } from "react";

function App() {
  const [basicString, useBasicString] = useState(String);
  fetch("http://localhost:3000")
    .then((res) => res.text())
    .then((data) => useBasicString(data));
  return (
    <div>
      <h1 className="text-3xl font-bold underline">{basicString}</h1>
    </div>
  );
}

export default App;
