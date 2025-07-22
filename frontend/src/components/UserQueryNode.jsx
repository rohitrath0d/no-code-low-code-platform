import { Handle, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import { FolderInput } from 'lucide-react';


export default function UserQueryNode({ data, isConnectable }) {
  const [query, setQuery] = useState(data.query || '');

  useEffect(() => {
    data.query = query;
  }, [query]);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 w-72 bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 ">
      {/* <div className="flex items-center justify-between mb-3"> <FolderInput /> */}
      <div className="flex gap-3 mb-3"> <FolderInput />
        <h3 className="text-lg font-bold text-gray-800">User Query</h3>
        {/* <div className="w-3 h-3 rounded-full bg-blue-500"></div> */}
      </div>

      <div className="mb-2">
        <p className="text-xs border-2 border-gray-300 bg-blue-100 rounded text-gray-700 mb-2">Enter point for query:</p>
        <textarea
          className="w-full border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write your query here"
        />
      </div>

      <div>
        <Handle
          type="source"
          position={Position.Right}
          id="query"
          style={{ background: '#3B82F6', width: '10px', height: '10px' }}
          isConnectable={isConnectable}
        />
      </div>

    </div>
  );
}