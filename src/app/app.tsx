import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { routes } from './routing/config'
import './index.css'

export const App = () => {
  return (
    <BrowserRouter>
      <main className="app">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/use-async-data">Use Async Data</Link>
        </nav>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </main>
    </BrowserRouter>
  )
}
