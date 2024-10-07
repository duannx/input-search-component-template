import "./App.css";
import Input from "./components/Input/index.tsx";

function App() {
    const handleSelectItem = (item: string) => {
        console.log(`Selected item: ${item}`);
    };
    return (
        <>
            <Input onSelectItem={handleSelectItem} />
        </>
    );
}

export default App;
