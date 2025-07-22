
import './App.css'
import WorkflowPage from './pages/WorkflowPage'
import StacksPage from './pages/StacksPage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from "sonner";
import Home from './pages/HomePage';
import { WorkflowProvider } from './contexts/WorkflowContext';


function App() {

  return (
    <>
      {/* <div className="text-5xl font-bold">
    Hello frontend
      </div> */}
      <WorkflowProvider>

        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stack" element={<StacksPage />} />

          {/* <WorkflowPage/> */}

          {/* <Route path="/stack" element={<StacksPage />} /> */}
          {/* <Route path="/workflow" element={<WorkflowPage />} /> */}
          <Route path="/editor/:stackId" element={<WorkflowPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />


        </Routes>
      </WorkflowProvider>
    </>
  )
}

export default App
