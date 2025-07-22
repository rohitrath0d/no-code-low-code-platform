import { Handle, Position } from 'reactflow';
import { useState, useEffect } from 'react';
import { MessageSquareReply } from 'lucide-react';


export default function OutputNode({ data }) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (data && data.llm_response) {
      setOutput(data.llm_response);
    }
  }, [data]);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 w-72 relative bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 ">
      {/* <div className="flex items-center justify-between mb-3">  <MessageSquareReply /> */}
      <div className="flex gap-3 mb-3">  <MessageSquareReply />
        <h3 className="text-lg font-bold text-gray-800">Output</h3>
        {/* <div className="w-3 h-3 rounded-full bg-yellow-500"></div> */}
      </div>

      <div className="space-y-2">
        {/* <p className="text-xs text-gray-500">Output of the result nodes as text</p> */}
        <p className="text-xs border-2 border-gray-300 bg-blue-100 rounded text-gray-700 mb-2">Output of the result nodes as text: </p>
        <div className="bg-gray-50 border border-gray-300 rounded-md p-3 h-32 overflow-y-auto bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap ">
            {output || 'No response yet.'}
          </pre>
        </div>
      </div>

      <Handle type="source" position={Position.Left} style={{ background: '#3B82F6', width: '10px', height: '10px' }} />
    </div>
  );
}