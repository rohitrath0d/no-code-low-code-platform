import { Handle, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
// import { toast } from 'sonner';


export default function LLMEngineNode({ data, isConnectable }) {        // data been receiving as prop - hence data.config being defined from here.
  const [model, setModel] = useState('gpt-4o');
  const [customPrompt, setCustomPrompt] = useState('You are a helpful PDF assistant. Use Web Search when content is not available.');
  // const [temperature, setTemperature] = useState(0.75);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [serpApiKey, setSerpApiKey] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // useEffect(() => {
  //   data.config = {
  //     model,
  //     customPrompt,
  //     // temperature,
  //     serpApiKey,
  //     webSearchEnabled
  //   };
  //   // }, [model, customPrompt, temperature, serpApiKey, webSearchEnabled]);
  // }, [model, customPrompt, serpApiKey, webSearchEnabled, data]);

  // Initialize from data.config if available
  useEffect(() => {
    if (data.config) {
      setModel(data.config.model || 'gemini-pro');
      setCustomPrompt(data.config.customPrompt || 'You are a helpful PDF assistant. Use Web Search when content is not available.');
      setSerpApiKey(data.config.serpApiKey || '');
      setGeminiApiKey(data.config.geminiApiKey || ''); // Initialize Gemini key
      setWebSearchEnabled(data.config.webSearchEnabled || false);
    }
  }, [data.config]);

  // Update data.config whenever any config changes
  useEffect(() => {
    data.config = {
      model,
      customPrompt,
      serpApiKey,
      geminiApiKey, // Include Gemini key in config
      webSearchEnabled
    };
  }, [model, customPrompt, serpApiKey, geminiApiKey, webSearchEnabled, data]);


  // Validate API key format
  const validateApiKey = (key) => {
    return key.startsWith('AIza') && key.length > 30;
  };



  return (
    // <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 w-80 relative">
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 w-80 relative bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 ">
      {/* <div className="flex items-center justify-between mb-3">  <Brain /> */}
      <div className="flex gap-3 mb-3">  <Brain />
        <h3 className="text-lg font-bold text-gray-800">LLM (Gemini AI)</h3>
        {/* <div className="w-3 h-3 rounded-full bg-purple-500"></div> */}
      </div>

      <div className="space-y-3">
        <div>

          {/* <p className="text-xs text-gray-500 mb-1">Run a query with OpenAI LLM:</p> */}
          <p className="text-xs border-2 border-gray-300 bg-blue-100 rounded text-gray-700 mb-2">Run a query with OpenAI LLM:</p>

          {/* <div className="grid grid-cols-2 gap-2"> */}
          <div className="grid ">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4o"> Gemini 2.0 Flash</option>
                {/* <option value="gemini-1.5-pro">Gemini 1.5 Pro</option> */}
                {/* <option value="gemini-flash">Gemini Flash</option> */}
                {/* <option value="gpt-3.5-turbo">GPT-3.5 Turbo (not available)</option> */}
                {/* <option value="gpt-3.5-turbo">GPT-3.5 Turbo (not available)</option> */}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">API key</label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="AIzaSy..."
              />
              {geminiApiKey && !validateApiKey(geminiApiKey) && (
                <p className="text-xs text-red-500 mt-1">Invalid API key format</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Prompt</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm h-20 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your custom system that you want to ask..."
          />
        </div>

        {/* <div className="grid grid-cols-2 gap-4"> */}
        <div className="grid">
          {/* <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Temperature</label>
            <input
              type="number"
              step="0.01"
              max="1"
              min="0"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">WebSearch Tool</label>
            {/* <div className="flex items-center gap-2"> */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={webSearchEnabled}
                onChange={(e) => setWebSearchEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-xs font-semibold">User SerpAPI for web search? </span>
            </div>
            <input
              type="password"
              placeholder="Serp API Key"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#3B82F6', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#3B82F6', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}