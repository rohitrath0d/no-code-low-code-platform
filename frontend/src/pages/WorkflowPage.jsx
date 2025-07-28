/* eslint-disable no-unused-vars */
import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  // useNodesState,
  // useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";


import nodeTypes from "../components/NodeRenderer"; // dynamic component renderer
import edgeTypes from "@/components/EdgeRenderer";
import { useNavigate, useParams } from 'react-router-dom';
import { Play, MessageSquare, Send, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getUserProfile, logout as authLogout } from '../util/auth';  // this fetches user me
// import toast from "../components/ui/sonner"
import { toast } from "sonner"
import Navigation from "../components/Navigation";
import { useWorkflow } from "../contexts/WorkflowContext";




// const initialNodes = [];
// const initialEdges = [];

const COMPONENTS = [
  // { label: "User Query", type: "userQuery" },
  { label: "User Query", type: "query" },
  // { label: "Knowledge Base", type: "knowledgeBase" },
  { label: "Knowledge Base", type: "knowledge_base" },
  // { label: "LLM (OpenAI)", type: "llmEngine" },
  { label: "LLM Engine", type: "llm_engine" },
  { label: "Output", type: "output" },
];


export default function WorkflowPage() {

  const reactFlowWrapper = useRef(null);

  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  //  fetching context for the states over the component via context API 
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } = useWorkflow();

  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [chatLogs, setChatLogs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentContext, setCurrentContext] = useState(null);

  const [workflowMeta, setWorkflowMeta] = useState({
    name: 'Untitled Workflow',
    description: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { stackId } = useParams();


  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const profile = await getUserProfile();
  //     setUser(profile);
  //   };
  //   fetchUser();
  // }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const profile = await getUserProfile();

        if (!profile) {
          throw new Error('No profile data returned');
        }

        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(err.message);

        // Clear tokens if we got unauthorized response
        if (err.message.includes('401')) {
          authLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const loadWorkflow = async () => {
      try {

        if (!stackId) {
          throw new Error('Stack ID is required');
        }

        const res = await fetch(`http://127.0.0.1:8000/api/workflow/load/${stackId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!res.ok) throw new Error('Failed to load workflow');
        const data = await res.json();
        // setNodes(data.nodes);
        // setEdges(data.edges);
        // if (data.nodes) setNodes(data.nodes);

        setWorkflowMeta({
          name: data.name,
          description: data.description || ''
        });

        // if (data.edges) setEdges(data.edges);
        setNodes(data.components?.nodes || []);
        setEdges(data.components?.edges || []);

      } catch (err) {
        console.error("Error loading workflow", err)
        toast(err.message);
        navigate('/stack');  // Redirect if there's an error
      }
    };

    if (stackId) loadWorkflow();
  }, [stackId]);


  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSave = async () => {
      if (!stackId) return;

      setIsSaving(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/workflow/${stackId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            // name: "Current Workflow", // Update with your state
            // name: form.name, // Update with your state
            // name: data.name, // Update with your state
            name: workflowMeta.name, // // Use state directly
            // description: "Auto-saved workflow",
            // description: form.description,
            // description: data.description,
            description: workflowMeta.description,
            components: {
              nodes: nodes,
              edges: edges
            }
          })
        });
        if (!res.ok) throw new Error("Auto-save failed");

        const data = await res.json();

        setWorkflowMeta({
          name: data.name,
          description: data.description || ''
        });
        setNodes(data.components?.nodes || []);
        setEdges(data.components?.edges || []);

        console.log("Auto-saved successfully");
      } catch (err) {
        console.error("Auto-save error:", err);
      } finally {
        setIsSaving(false)
      }
    };

    const interval = setInterval(autoSave, 30000);          // auto saving actions every 30 seconds
    return () => clearInterval(interval);
  }, [stackId, nodes, edges, workflowMeta, setEdges, setNodes]);

  // fetching chat logs
  useEffect(() => {
    if (stackId && chatOpen) {
      //   fetch(`http://127.0.0.1:8000/api/chat-logs/${stackId}`)
      //     .then(res => res.json())
      //     .then(setChatLogs)
      //     .catch(err => console.error(err));
      // }

      const fetchChatLogs = async () => {
        if (!stackId || !chatOpen) return;
        try {

          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          const res = await fetch(`http://127.0.0.1:8000/api/chat-logs/${stackId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            }
          });
          if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
          const data = await res.json();
          setChatLogs(data);
        } catch (err) {
          console.error("Failed to fetch chat logs", err);
          toast("chat logs err: ", err);
          setChatLogs([]); // Reset to empty array on error
        }
      };
      fetchChatLogs();
    }
  }, [stackId, chatOpen]);


  const onConnect = (params) => {
    setEdges((eds) => addEdge({
      ...params,
      type: "dashed",
      animated: false,
    }, eds));
  }


  // const onDragStart = (event, type) => {
  const onDragStart = (event, nodeTypes) => {
    // event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.setData("application/reactflow", nodeTypes);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // Check if we're dropping on the reactflow wrapper
      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Ensure we have a valid type
      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        // id: `${+new Date()}`,
        id: `${Date.now()}`,
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleChatSubmit = async () => {
    if (!query.trim()) {
      toast("Please enter a query");
      return;
    };

    // Add user message to chat
    const userMessage = {
      text: query,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);
    setQuery('');

    try {
      // const res = await fetch("http://localhost:8000/run-workflow", {
      const res = await fetch("http://127.0.0.1:8000/api/workflow/run-workflow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: 'Execute workflow',
          custom_prompt: "",
          top_k: 1,
          workflow_id: parseInt(stackId),
          // components: []

          // This sends the full graph config of all the components to the backend
          components: nodes.map(n => ({
            id: n.id,
            type: n.type,
            config: n.data?.config || {},
            position: n.position              // including position for debugging
          })),
          chat_history: chatHistory // Send the full chat history
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Workflow execution failed');
      }

      const data = await res.json();
      console.log(data);

      // Add AI response (simulating the response from your screenshot)
      // const aiMessage = {
      //   text: `# GenAI Stack Chat\n\n## Can you share stock records of Coca Cola and Pepsí for last 5 years?\n\n1. **Coca-Cola (KO):** Coca-Cola's stock has steadily grown over the past 5 years, thanks to diversification into non-soda beverages. The pandemic caused a temporary dip in its stock price, but it has since rebounded. Its consistent dividend payouts make it appealing to long-term investors.\n\n2. **PepsiCo (PEP):** PepsiCo's stock has shown stable growth, thanks to its diversified portfolio, including food and beverages, which shields it from market volatility. The company's resilience during the pandemic led to a strong recovery, and steady dividends have attracted income-focused investors.\n\nIn conclusion, both companies have demonstrated resilience and steady growth over the past 5 years, appealing to growth and income-focused investors.`,
      //   sender: 'ai',
      //   isMarkdown: true
      // };
      // setMessages(prev => [...prev, aiMessage]);

      // adding AI response
      const aiMessage = {
        text: data.llm_response,
        sender: 'ai',
        isMarkdown: true,
        timestamp: new Date().toISOString(),
        context: data.context_used
      };
      setMessages(prev => [...prev, aiMessage]);
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.llm_response }]);
      setCurrentContext(data.context_used);

    } catch (err) {
      console.error(err);
      const errorMessage = {
        text: err.message || "Error processing your request",
        sender: 'ai',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error(err.message);
    }
  };

  const buildWorkflow = async () => {
    try {
      if (nodes.length === 0) {
        toast.warning("Please add at least one node to the workflow");
        return;
      }

      // Check if we have all required nodes connected
      const hasOutputNode = nodes.some(n => n.type === 'output');
      if (!hasOutputNode) {
        toast.warning("Please add an Output node to your workflow");
        return;
      }

      toast.info("Building and executing workflow...");

      const res = await fetch("http://127.0.0.1:8000/api/workflow/run-workflow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: "Execute workflow", // Default query for build
          custom_prompt: "",
          top_k: 1,
          workflow_id: parseInt(stackId),
          components: nodes.map(n => ({
            id: n.id,
            type: n.type,
            config: n.data?.config || {},
            position: n.position
          }))
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Workflow execution failed');
      }

      const data = await res.json();
      toast.success("Workflow executed successfully!");

      // Find the output node and update it with the response
      const outputNodeIndex = nodes.findIndex(n => n.type === 'output');
      if (outputNodeIndex !== -1) {
        const updatedNodes = [...nodes];
        updatedNodes[outputNodeIndex] = {
          ...updatedNodes[outputNodeIndex],
          data: {
            ...updatedNodes[outputNodeIndex].data,
            llm_response: data.llm_response,
            context_used: data.context_used,
            results: data.results,
            timestamp: new Date().toISOString()
          }
        };
        setNodes(updatedNodes);
      }

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // runLLM();
      handleChatSubmit();
    }
  };

  return (

    <ReactFlowProvider>

      <div className="flex flex-col h-screen overflow-hidden">
        <Navigation />
        <div className="flex flex-1 relative min-h-0 bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 ">

          {/* Sidebar */}
          {/* <div className="w-64 bg-gray-100 border-r p-4">
          <h2 className="text-xl font-semibold mb-4">Components</h2>
          <div className="space-y-2">
            {COMPONENTS.map((comp) => (
              <button 
                key={comp.type}
                draggable
                onDragStart={(e) => onDragStart(e, comp.type)}
                className="w-full px-4 py-2 bg-white rounded border hover:bg-gray-50 cursor-move"
              >
                {comp.label}
              </button>
            ))}
          </div>
        </div> */}

          {/* <div className="w-64 bg-gray-100 border-r p-4 flex flex-col justify-between "> */}
          <div className="w-64 border-r p-4 flex flex-col justify-between bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 overflow-y-auto">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Components</h2>
              <div className="space-y-2">
                {COMPONENTS.map((comp) => (
                  <button
                    key={comp.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, comp.type)}
                    // className="w-full px-4 py-2 bg-white rounded-xl border hover:bg-gray-50 cursor-move"
                    className="w-full px-4 py-2 text-xs rounded-xl border-1 border-gray-700 cursor-move bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100"
                  >
                    {comp.label}
                  </button>
                ))}
              </div>
              {/* <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => alert("Build triggered!")}
            >
              Build
            </Button> */}
            </div>

            {user && (
              <div className="mt-3 text-sm text-gray-600 border-t pt-4">
                <p className="font-medium text-gray-800">Logged in as:</p>
                <p>{user.name}</p>
                <p className="text-xs text-gray-500 mb-4">{user.email}</p>

                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100"
                    >
                      Logout  <LogOut />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
                    <DialogHeader>
                      <DialogTitle>Confirm Logout</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to log out?</p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setShowLogoutDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          localStorage.removeItem("token");
                          setShowLogoutDialog(false);
                          // toast.success("Successfully logged out");
                          toast("Successfully logged out");
                          navigate("/login");
                        }}
                      >
                        Yes, Logout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Canvas */}
          {/* <div className="flex-1 h-full" ref={reactFlowWrapper}> */}
          <div className="flex-1 min-w-0" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              snapToGrid={true}  // Add this
              snapGrid={[15, 15]}  // Add this
              connectionRadius={20}  // Increase connection radius

              connectionLineStyle={{
                strokeWidth: 2,
                stroke: '#3B82F6',
                strokeDasharray: '5,5', // Dashed effect
              }}
              connectionLineComponent={({ fromX, fromY, toX, toY }) => (
                <g>
                  <path
                    fill="none"
                    stroke="#D000FF"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    d={`M${fromX},${fromY} C${fromX + 50},${fromY} ${toX - 50},${toY} ${toX},${toY}`}
                  />
                  <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#3B82F6" strokeWidth={1.5} />
                </g>
              )}
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={2} />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-10">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-green-200 text-green-900 hover:bg-green-300"
              // onClick={() => alert('Build Stack feature not wired yet')}
              // onClick={runLLM()}
              // onClick={runLLM}
              onClick={buildWorkflow}
              title="Build and execute workflow"
            >
              <Play className="w-5 h-5" />
            </Button>

            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-blue-200 text-blue-900 hover:bg-blue-300"
                  // onClick={}
                  title="Chat with workflow"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[900px] max-w-none h-[80vh] flex flex-col bg-white p-0">
                <DialogHeader className="border-b p-4 bg-white">
                  <DialogTitle className="text-lg">GenAI Stack Chat</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">

                  <div className="space-y-3 text-sm bg-gray-50 border rounded-md p-3 max-h-[250px] overflow-auto">

                    {chatLogs.length > 0 && (
                      <div className="border rounded p-3 text-sm bg-gray-50 mb-4 max-h-[250px] overflow-y-auto">
                        <p className="text-gray-500 text-xs mb-2">Previous Logs</p>
                        {chatLogs.map(log => (
                          <div key={log.id} className="mb-3">
                            <div className="font-semibold text-blue-900">You:</div>
                            <div className="mb-1">{log.user_query}</div>
                            <div className="font-semibold text-green-900">Bot:</div>
                            <div>{log.response}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-10">
                        Ask something to get started...
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[90%] rounded-lg p-4 ${message.sender === 'user'
                              ? 'bg-blue-100 text-blue-900'
                              : message.isError
                                ? 'bg-red-100 text-red-900'
                                : 'bg-gray-50 text-gray-900 border border-gray-200'
                              }`}
                          >
                            {message.isMarkdown ? (
                              <div className="prose max-w-none">
                                {message.text.split('\n').map((line, i) => (
                                  <React.Fragment key={i}>
                                    {line.startsWith('# ') ? (
                                      <h1 className="text-xl font-bold">{line.substring(2)}</h1>
                                    ) : line.startsWith('## ') ? (
                                      <h2 className="text-lg font-semibold">{line.substring(3)}</h2>
                                    ) : line.startsWith('1. ') ? (
                                      <li className="list-decimal ml-5">{line.substring(3)}</li>
                                    ) : line.startsWith('**') && line.endsWith('**') ? (
                                      <strong>{line.substring(2, line.length - 2)}</strong>
                                    ) : (
                                      <p>{line}</p>
                                    )}
                                    <br />
                                  </React.Fragment>
                                ))}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            )}
                            {message.context && message.sender === 'ai' && (
                              <div className="mt-2 text-xs text-gray-500">
                                <details>
                                  <summary>Context used</summary>
                                  <div className="mt-1 p-2 bg-gray-100 rounded">
                                    {message.context}
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t p-4 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        // onKeyDown={handleKeyDown}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleChatSubmit();
                          }
                        }}
                        className="flex-1 border px-3 py-2 rounded text-sm"
                        placeholder="Ask something..."
                        rows={1}
                      />
                      <Button
                        // onClick={runLLM} 
                        onClick={handleChatSubmit}
                        className="flex items-center gap-1"
                        disabled={!query.trim()}
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ReactFlowProvider>

  );
}