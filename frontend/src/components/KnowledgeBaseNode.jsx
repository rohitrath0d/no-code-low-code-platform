// import { useState, useCallback } from 'react';
// import { Handle, Position } from 'reactflow';

// export default function KnowledgeBaseNode() {
//   const [file, setFile] = useState(null);
//   const [previewText, setPreviewText] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploaded, setUploaded] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileUpload = useCallback(async () => {
//     if (!file) return;
//     setUploading(true);
//     setError('');
//     setUploaded(false);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await fetch('http://localhost:8000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) throw new Error('Upload failed');
//       const data = await res.json();
//       setPreviewText(data.preview_text);
//       setUploaded(true);
//     } catch (err) {
//       console.error(err);
//       setError('Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   }, [file]);

//   return (
//     <div className="bg-white border rounded-xl shadow-md p-4 w-80 relative">
//       <Handle type="target" position={Position.Top} />
//       <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>

//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         className="mb-2"
//       />

//       {file && (
//         <button
//           onClick={handleFileUpload}
//           disabled={uploading}
//           className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
//         >
//           {uploading ? 'Uploading...' : 'Upload'}
//         </button>
//       )}

//       {uploaded && (
//         <div className="mt-2 text-green-600 text-sm">
//           ✅ Uploaded successfully
//         </div>
//       )}
//       {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

//       {previewText && (
//         <div className="mt-3 text-xs text-gray-700 max-h-40 overflow-y-auto">
//           <strong>Preview:</strong> {previewText}
//         </div>
//       )}

//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }


// /* eslint-disable no-unused-vars */
// import { useState } from 'react';
// import { Handle, Position } from 'reactflow';

// export default function KnowledgeBaseNode() {
//   const [file, setFile] = useState(null);
//   const [model, setModel] = useState('text-embedding-3-large');
//   const [apiKey, setApiKey] = useState('');
//   const [query, setQuery] = useState('');

//   const handleUpload = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile) {
//       setFile(uploadedFile);
//     }
//   };

//   return (
//     <div className="bg-white border rounded-xl shadow-md p-4 w-[420px] relative">
//       <Handle type="target" position={Position.Top} />
//       <h3 className="text-lg font-semibold mb-3">Knowledge Base</h3>

//       <div className="mb-3">
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           Upload File
//         </label>
//         <input
//           type="file"
//           onChange={handleUpload}
//           className="w-full border text-sm rounded px-2 py-1"
//         />
//         {file && (
//           <p className="text-xs mt-1 text-gray-500">Selected: {file.name}</p>
//         )}
//       </div>

//       <div className="mb-3">
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           Embedding Model
//         </label>
//         <select
//           value={model}
//           onChange={(e) => setModel(e.target.value)}
//           className="w-full border text-sm px-2 py-1 rounded"
//         >
//           <option value="text-embedding-3-large">text-embedding-3-large</option>
//           <option value="text-embedding-ada-002">text-embedding-ada-002</option>
//         </select>
//       </div>

//       <div className="mb-3">
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           API Key
//         </label>
//         <input
//           type="password"
//           value={apiKey}
//           onChange={(e) => setApiKey(e.target.value)}
//           className="w-full border px-2 py-1 rounded text-sm"
//         />
//       </div>

//       <div className="mb-3">
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           Query
//         </label>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full border px-2 py-1 rounded text-sm"
//         />
//       </div>

//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }


/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function KnowledgeBaseNode() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('text-embedding-3-large');
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-md p-4 w-[420px] relative">
      <Handle type="target" position={Position.Top} />
      <h3 className="text-lg font-semibold mb-3">Knowledge Base</h3>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Upload File
        </label>
        <input
          type="file"
          onChange={handleUpload}
          className="w-full border text-sm rounded px-2 py-1"
        />
        {file && (
          <p className="text-xs mt-1 text-gray-500">Selected: {file.name}</p>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Embedding Model
        </label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border text-sm px-2 py-1 rounded"
        >
          <option value="text-embedding-3-large">text-embedding-3-large</option>
          <option value="text-embedding-ada-002">text-embedding-ada-002</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full border px-2 py-1 rounded text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Query
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border px-2 py-1 rounded text-sm"
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
