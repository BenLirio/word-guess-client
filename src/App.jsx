import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter basename="/word-guess-client">
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold text-xl text-blue-600">
              My Vite App
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner p-4 mt-8">
          <div className="container mx-auto text-center text-gray-500">
            © {new Date().getFullYear()} My Vite App. All rights reserved.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
