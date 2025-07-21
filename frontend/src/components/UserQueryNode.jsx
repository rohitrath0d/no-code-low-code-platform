import { Handle, Position } from 'reactflow';
import { useEffect, useState } from 'react';

export default function UserQueryNode({ data, isConnectable }) {
  const [query, setQuery] = useState(data.query || '');

  useEffect(() => {
    data.query = query;
  }, [query]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border w-64">
      <div className="text-sm font-semibold text-gray-700 mb-2">User Query</div>
      <textarea
        className="w-full border p-2 rounded text-sm resize-none focus:outline-none focus:ring"
        rows={4}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your query here"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="query"
        style={{ background: '#4F46E5' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}
