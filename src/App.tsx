import './App.css';
import Input from './components/Input';

function App() {
  const placeholder = "Type something to search...";

  const handleSelectItem = (value: any) => {
    alert(`Search result: ${value}`);
  };

  return (
    <Input placeholder={placeholder} onSelectItem={handleSelectItem} />
  )
}

export default App
