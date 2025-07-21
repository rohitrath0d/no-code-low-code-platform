import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export default function OutputNode({ data }) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (data && data.llm_response) {
      setOutput(data.llm_response);
    }
  }, [data]);

  return (
    <div className="bg-white border rounded-xl shadow-md p-4 w-80 relative">
      <Handle type="target" position={Position.Top} />
      <h3 className="text-lg font-semibold mb-2">Output</h3>

      <div className="text-sm bg-gray-100 p-2 rounded h-32 overflow-y-auto whitespace-pre-wrap">
        {output ? output : 'No response yet.'}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
