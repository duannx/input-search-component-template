import "./App.css";
import Input from "./components/Input";

function App() {
  return (
    <>
      <Input
        placeholder="Type something to search..."
        onSelectItem={(value) => {
          console.log("Item selected: ", value);
        }}
      />
    </>
  );
}

export default App;
