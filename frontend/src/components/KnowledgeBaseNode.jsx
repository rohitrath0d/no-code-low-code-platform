import { Handle, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import { FolderUp, BookOpen } from "lucide-react"
import { toast } from "sonner"
import { API_BASE_URL } from '@/util/auth';


export default function KnowledgeBaseNode({ data, isConnectable }) {             // data been receiving as prop - hence data.config being defined from here.
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  // const [model, setModel] = useState('text-embedding-3-large');
  const [model, setModel] = useState('all-MiniLM-L6-v2 (Huggingface)');
  // const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  // const [uploadedFiles, setUploadedFiles] = useState([]);       // prev should be defined as array not bool
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const saved = localStorage.getItem('knowledgeBaseFiles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    data.config = {
      fileName: file?.name,
      fileId,
      model,
      // apiKey,
      query,
      // uploadedFiles
    };
    // }, [file, model, apiKey, query]);
    // }, [file, fileId, model, apiKey, query, uploadedFiles, data]);
  }, [file, fileId, model, query, data]);


  // Initialize from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('knowledgeBaseFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
      // Set the first file as active if exists
      if (JSON.parse(savedFiles).length > 0) {
        const lastFile = JSON.parse(savedFiles)[0];
        setFile({ name: lastFile.name });
        setFileId(lastFile.id);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('knowledgeBaseFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);



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
        // const res = await fetch("http://127.0.0.1:8000/api/upload", {
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
          // },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // if (!res.ok) throw new Error('Upload failed');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          toast(errorData.message)
          throw new Error(errorData.message || 'Upload failed');
        }

        // const json = await res.json();
        const data = await res.json();
        // if (json?.file_id || json?.path) {
        //   setFileId(json.file_id || json.path);
        // } else {
        //   alert("Upload failed. No file_id returned.");
        // }

        if (!data.file_id) {
          toast("Upload failed. No file_id returned from the server!");
          throw new Error('No file_id returned from server');

        }

        // else {
        //   // alert("Upload failed. No file_id returned from the server!");
        //   toast("File uploaded successfully!")
        //   setFileId(data.file_id)       // have to set the file id
        // }

        // Update all relevant states
        setFileId(data.file_id);

        // Store in local state
        setUploadedFiles((prev) => [...prev, {
          id: data.file_id,
          name: data.filename,
          date: new Date(data.uploaded_at).toLocaleString()
        }]);

        toast.success("File uploaded successfully!");

        return {
          success: true,
          fileId: data.file_id,
          document: data.document
        };
      } catch (err) {
        console.error(err);
        // alert("Upload failed");
        toast(err.message);
        return { success: false };

      } finally {
        setUploading(false);
      }
    }
  };

  const removeFile = () => {
    setUploadedFiles([]);
    setFile(null);
    setFileId('');
    toast.info("File removed");
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

          {/* Uploaded Files Section - Only show when there's a file */}
          {uploadedFiles.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-600 mb-1 flex justify-between">
                <span>Current File</span>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
              <div className="p-2 border border-gray-200 rounded bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="truncate">{uploadedFiles[0].name}</span>
                  <span className="text-gray-500 text-xs">{uploadedFiles[0].date}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Embedding Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {/* <option value="text-embedding-3-large">text-embedding-3-large</option> */}
            <option value="text-embedding-3-large">all-MiniLM-L6-v2 (Huggingface)</option>
            {/* <option value="text-embedding-ada-002">text-embedding-ada-002</option> */}
          </select>
        </div>

        {/* <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">API key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

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

      <Handle
        id="knowledge-input"
        // type="source"  
        type="target"     // target - input
        position={Position.Left}
        style={{
          background: '#D000FF', width: '12px', height: '12px',
          zIndex: 10,  // Ensure it stays above other elements 
          border: '2px solid black'  // Adds visibility
        }}
        isConnectable={isConnectable}
        className="!left-[-6px]" // Adjust position to be just outside node
        />

      <Handle
        // type="target" 
        id="knowledge-output"
        type="source"     // source- output  
        position={Position.Right}
        style={{
          background: '#D000FF',
          width: '12px',
          height: '12px',
          zIndex: 10,  // Ensure it stays above other elements
          border: '2px solid black'
        }}
        isConnectable={isConnectable}
        className="!right-[-6px]" // Adjust position to be just outside node
      />
    </div>
  );
}