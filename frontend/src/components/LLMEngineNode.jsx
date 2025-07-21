// /* eslint-disable no-unused-vars */
// import { useState } from 'react';
// import { Handle, Position } from 'reactflow';

// export default function LLMEngineNode() {
//   const [model, setModel] = useState('gemini');
//   const [customPrompt, setCustomPrompt] = useState('');
//   const [query, setQuery] = useState('');
//   const [context, setContext] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);

//   const runLLM = async () => {
//     setLoading(true);
//     setResponse('');

//     try {
//       const res = await fetch('http://localhost:8000/run-workflow', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           query,
//           custom_prompt: customPrompt,
//           top_k: 1,
//           components: [
//             {
//               id: '1',
//               type: 'llm_engine',
//               config: { model }
//             }
//           ]
//         })
//       });

//       const data = await res.json();
//       setContext(data.context_used || '');
//       setResponse(data.llm_response || 'No response.');
//     } catch (err) {
//       console.error(err);
//       setResponse('Error contacting LLM engine.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white border rounded-xl shadow-md p-4 w-96 relative">
//       <Handle type="target" position={Position.Top} />
//       <h3 className="text-lg font-semibold mb-2">LLM Engine</h3>

//       <div className="mb-2">
//         <label className="block text-sm font-medium">Model</label>
//         <select
//           value={model}
//           onChange={(e) => setModel(e.target.value)}
//           className="w-full border px-2 py-1 rounded"
//         >
//           <option value="gemini">Gemini</option>
//           <option value="openai">OpenAI</option>
//           {/* You can add more models here */}
//         </select>
//       </div>

//       <div className="mb-2">
//         <label className="block text-sm font-medium">Custom Prompt (optional)</label>
//         <textarea
//           value={customPrompt}
//           onChange={(e) => setCustomPrompt(e.target.value)}
//           className="w-full border px-2 py-1 rounded text-sm"
//           rows="2"
//         />
//       </div>

//       <div className="mb-2">
//         <label className="block text-sm font-medium">User Query</label>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full border px-2 py-1 rounded text-sm"
//         />
//       </div>

//       <button
//         onClick={runLLM}
//         disabled={loading}
//         className="bg-indigo-600 text-white px-4 py-1 rounded text-sm mt-2"
//       >
//         {loading ? 'Running...' : 'Run LLM'}
//       </button>

//       {response && (
//         <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
//           <strong>LLM Response:</strong>
//           <p className="text-xs mt-1 whitespace-pre-wrap">{response}</p>
//         </div>
//       )}

//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }



/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function LLMEngineNode() {
  const [model, setModel] = useState('gpt-4o');
  const [customPrompt, setCustomPrompt] = useState('');
  const [query, setQuery] = useState('');
  const [temperature, setTemperature] = useState(0.75);
  const [serpApiKey, setSerpApiKey] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  const runLLM = async () => {
    try {
      const res = await fetch('http://localhost:8000/run-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          custom_prompt: customPrompt,
          top_k: 1,
          components: [
            {
              id: '1',
              type: 'llm_engine',
              config: {
                model,
                temperature,
                use_serp: webSearchEnabled,
                serp_api_key: serpApiKey
              }
            }
          ]
        })
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-md p-4 w-[420px] relative">
      <Handle type="target" position={Position.Top} />
      <h3 className="text-lg font-semibold mb-3">LLM (OpenAI)</h3>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Model
        </label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border text-sm px-2 py-1 rounded"
        >
          <option value="gpt-4o">GPT 4o - Mini</option>
          <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          API Key
        </label>
        <input
          type="password"
          className="w-full border px-2 py-1 rounded text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Prompt
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full border px-2 py-1 rounded text-sm"
          rows={3}
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Temperature
        </label>
        <input
          type="number"
          step="0.01"
          max="1"
          min="0"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full border px-2 py-1 rounded text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          WebSearch Tool
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={webSearchEnabled}
            onChange={(e) => setWebSearchEnabled(e.target.checked)}
          />
          <span className="text-sm">SerpAPI</span>
        </div>
        <input
          type="password"
          placeholder="Serp API Key"
          value={serpApiKey}
          onChange={(e) => setSerpApiKey(e.target.value)}
          className="w-full mt-1 border px-2 py-1 rounded text-sm"
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
