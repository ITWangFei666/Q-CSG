import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Day1 from './pages/Day1'
import Day2 from './pages/Day2'
import Day3 from './pages/Day3'
import Day4 from './pages/Day4'
import Day5 from './pages/Day5'
import Home from './pages/Home'
import Review from './pages/Review'
import ReviewDay from './pages/ReviewDay'
import './styles/index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/day1" element={<Day1 />} />
          <Route path="/day2" element={<Day2 />} />
          <Route path="/day3" element={<Day3 />} />
          <Route path="/day4" element={<Day4 />} />
          <Route path="/day5" element={<Day5 />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review-day" element={<ReviewDay />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
