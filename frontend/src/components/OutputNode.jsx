import { Handle, Position } from 'reactflow';
import { useState, useEffect } from 'react';
import { Check, Copy, MessageSquareReply } from 'lucide-react';
import { toast } from 'sonner';


export default function OutputNode({ data, isConnectable }) {
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // if (data && data.llm_response) {
    //   setOutput(data.llm_response);
    // }

    // Check for both possible response locations
    if (data?.llm_response) {
      setOutput(data.llm_response);
    } else if (data?.config?.llm_response) {
      setOutput(data.config.llm_response);
    }
  }, [data]);


  // Copy to clipboard function
  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard.writeText(output)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy text');
      });
  };

  // Format the output with proper line breaks and paragraphs
  // const formattedOutput = output
  //   ? output.split('\n').map((paragraph, i) => (
  //     <p key={i} className="mb-2 last:mb-0">
  //       {paragraph || <br />}
  //     </p>
  //   ))
  //   : 'No response yet.';


  return (
    <div className="rounded-lg shadow-sm p-4 w-72 relative bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 ">
      {/* <div className="flex items-center justify-between mb-3">  <MessageSquareReply /> */}
      <div className="flex gap-3 mb-3">  <MessageSquareReply className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Output</h3>
        {/* <div className="w-3 h-3 rounded-full bg-yellow-500"></div> */}
      </div>

      {output && (
        <button
          onClick={copyToClipboard}
          className="p-1 rounded-md hover:bg-gray-200 transition-colors"
          title="Copy to clipboard"
          disabled={copied}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600" />
          )}
        </button>
      )}

      <div className="space-y-2">
        {/* <p className="text-xs text-gray-500">Output of the result nodes as text</p> */}
        <p className="text-xs border-2 border-gray-300 bg-blue-100 rounded text-gray-700 mb-2"> Results from the workflow execution: </p>
        <div className="bg-gray-50 border border-gray-300 rounded-md p-3 h-48 bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100 overflow-y-auto">
          {/* <pre className="text-sm text-gray-800 whitespace-pre-wrap ">
            {output || 'No response yet.'}
          </pre> */}
          {/* 
          <div className="text-sm text-gray-800">
            {formattedOutput}
          </div> */}

          {output ? (
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {output}
            </div>
          ) : (
            <div className="text-gray-500 italic">No output generated yet</div>
          )}

        </div>




        {/* Additional metadata display */}
        {data?.timestamp && (
          <p className="text-xs text-gray-500 text-right mt-1">
            Generated at: {new Date(data.timestamp).toLocaleString()}
          </p>
        )}

      </div>

      <Handle
        type="target"
        position={Position.Left}
        // style={{ background: '#3B82F6', width: '10px', height: '10px' }}
        style={{
          background: '#D000FF',
          width: '12px',
          height: '12px',
          zIndex: 10,  // Ensure it stays above other elements
          border: '2px solid black'
        }}
        isConnectable={isConnectable}
        className="!right-[-6px]" // Adjust position to be just outside node
      // isConnectable={isConnectable}
      />
    </div >
  );
}