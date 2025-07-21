
import './App.css'
import WorkflowPage from './pages/WorkflowPage'
import StacksPage from './pages/StacksPage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from "sonner";
import Home from './pages/HomePage';


function App() {

  return (
    <>
      {/* <div className="text-5xl font-bold">
    Hello frontend
      </div> */}
      <Toaster position="top-center" richColors />

      <Routes>
        <Route path="/" element={<StacksPage />} />
        <Route path="/home" element={<Home />} />

        {/* <WorkflowPage/> */}
        <Route path="/workflow" element={<WorkflowPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        

      </Routes>
    </>
  )
}

export default App
