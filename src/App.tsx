import "./App.css";
import Input from "./components/Input";

function App() {
  return (
    <>
      <Input
        placeholder="Type something to search..."
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSelectItem={(_item: string) => {}}
      />
    </>
  );
}

export default App;
