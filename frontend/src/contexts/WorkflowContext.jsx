import { createContext, useContext, useState } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';


const initialNodes = [];
const initialEdges = [];

const WorkflowContext = createContext();

export function WorkflowProvider({ children }) {
  // const [nodes, setNodes, onNodesChange] = useState([]);
  // const [nodes, setNodes, onNodesChange] = useState(initialNodes);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useState([]);
  // const [edges, setEdges, onEdgesChange] = useState(initialEdges);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Function to delete selected edges
  // const deleteSelectedEdges = useCallback(() => {
  //   setEdges((eds) => eds.filter((edge) => !edge.selected));
  // }, [setEdges]);

  // // Function to delete edge by ID
  // const deleteEdgeById = useCallback((id) => {
  //   setEdges((eds) => eds.filter((edge) => edge.id !== id));
  // }, [setEdges]);


  return (
    <WorkflowContext.Provider value={{
      nodes, setNodes,
      onNodesChange, edges,
      setEdges, onEdgesChange,
      workflowName, setWorkflowName,
      workflowDescription, setWorkflowDescription,
      // deleteKeyCode,
      // useConnection
      // deleteSelectedEdges,
      // deleteEdgeById
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