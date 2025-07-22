import { createContext, useContext, useState } from 'react';


const initialNodes = [];
const initialEdges = [];

const WorkflowContext = createContext();

export function WorkflowProvider({ children }) {
  // const [nodes, setNodes, onNodesChange] = useState([]);
  const [nodes, setNodes, onNodesChange] = useState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useState([]);
  const [edges, setEdges, onEdgesChange] = useState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');



  return (
    <WorkflowContext.Provider value={{
      nodes, setNodes,
      onNodesChange, edges,
      setEdges, onEdgesChange,
      workflowName, setWorkflowName,
      workflowDescription, setWorkflowDescription
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  // return useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;

}