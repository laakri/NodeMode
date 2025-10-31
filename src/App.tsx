import './App.css'
import FlowCanvas from './pages/FlowCanvas'
import { ThemeProvider } from "@/components/theme-provider"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FlowCanvas />
    </ThemeProvider>
  )
}

export default App
