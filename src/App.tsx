import './App.css'
import Input from './components/Input'

function App() {

  const handleSelectItem = (item: string) => {
    console.log(item)
  }

  return (
    <Input placeholder='Type something to search...' onSelectItem={handleSelectItem} />
  )
}

export default App
