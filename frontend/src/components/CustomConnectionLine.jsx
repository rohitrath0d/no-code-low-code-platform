import { BaseEdge, getBezierPath } from 'reactflow';

export default function CustomConnectionLine({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath] = getBezierPath({
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          strokeDasharray: '5,5', // This creates the dashed effect
          stroke: '#3B82F6',
        }}
      />
    </>
  );
}