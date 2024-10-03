import "./App.css";
import Input from "./components/Input";

function App() {
  return (
    <>
      <Input
        placeholder="Type something to search..."
        onSelectItem={(item: string) => {}}
      />
    </>
  );
}

export default App;
