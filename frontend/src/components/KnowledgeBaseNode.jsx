import { Handle, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import { FolderUp, BookOpen   } from "lucide-react"

export default function KnowledgeBaseNode({ data }) {             // data been receiving as prop - hence data.config being defined from here.
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [model, setModel] = useState('text-embedding-3-large');
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    data.config = {
      // fileName: file?.name || '',
      fileId,
      model,
      apiKey,
      query
    };
    // }, [file, model, apiKey, query]);
  }, [fileId, model, apiKey, query]);


  // const handleUpload = (e) => {
  //   const uploadedFile = e.target.files[0];
  //   if (uploadedFile) {
  //     setFile(uploadedFile);
  //   }
  // };

  // uploading file via api
  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setUploading(true);

      const formData = new FormData();
      formData.append("file", uploadedFile);

      try {
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData
        });

        const json = await res.json();
        if (json?.file_id || json?.path) {
          setFileId(json.file_id || json.path);
        } else {
          alert("Upload failed. No file_id returned.");
        }
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    }
  };


  return (
    // <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 w-80 relative">
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 w-80 relative bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 ">
      {/* <div className="flex items-center justify-between mb-3"> <FolderInput /> */}
      <div className="flex gap-3 mb-3"> <BookOpen />
        <h3 className="text-lg font-bold text-gray-800">Knowledge Base</h3>
        {/* <div className="w-3 h-3 rounded-full bg-green-500"></div> */}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs border-2 border-gray-300 bg-blue-100 rounded text-gray-700 mb-2">Let LLM search info in your files (pdf) </p>
          <div className="flex items-center gap-2">
            {/* <label className="text-xs font-medium text-gray-600">File for Knowledge Base</label> */}
            {/* <span className="text-xs text-gray-400">•</span> */}
            {/* <button className="text-xs text-blue-600 hover:underline">Upload File</button> */}
          </div>
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center mt-1 w-full border border-dashed border-gray-500 rounded-md p-2 text-center cursor-pointer hover:bg-gray-50">
            {/* {file ? file.name : 'Click to upload'} */}
            {/* {uploading ? "Uploading..." : file ? file.name : "Click to upload"} <FolderUp className="" /> */}

            {uploading ? (
              "Uploading..."
            ) : file ? (
              file.name
            ) : (
              <div className="flex items-center gap-2"> {/* New wrapper div */}

                <p>Click to upload</p>

                <FolderUp
                  className="w-4 h-4"
                />
              </div>
            )}

          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Embedding Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="text-embedding-3-large">text-embedding-3-large</option>
            <option value="text-embedding-ada-002">text-embedding-ada-002</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">API key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#3B82F6', width: '10px', height: '10px' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#3B82F6', width: '10px', height: '10px' }} />
    </div>
  );
}