import UserQueryNode from './UserQueryNode';
import LLMEngineNode from './LLMEngineNode';
import OutputNode from './OutputNode';
import KnowledgeBaseNode from './KnowledgeBaseNode';

// NodeRenderer.jsx — a centralized renderer component for React Flow that dynamically selects and renders the right node component (UserQueryNode, LLMEngineNode, OutputNode) based on its type.

const  nodeTypes = {
  userQuery: UserQueryNode,
  llmEngine: LLMEngineNode,
  knowledgeBase: KnowledgeBaseNode,
  output: OutputNode,
};

export default nodeTypes;