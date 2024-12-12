import React from 'react';
import { getBezierPath } from '@xyflow/react';

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}) => {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Déterminer le marqueur selon le type de relation
    let markerStart = null;
    let markerEnd;
    switch (data?.relationType) {
        case 'inheritance': // Héritage
            markerEnd = 'url(#arrowhead)';
            break;
        case 'aggregation': // Agrégation faible
            markerEnd = 'url(#diamond-empty)';
            break;
        case 'composition': // Agrégation forte
            markerEnd = 'url(#diamond-filled)';
            break;
        case 'implementation':
            markerEnd = 'url(#dashed-line)';
            break;

        default:
            markerEnd = null; // Association normale (aucun marqueur spécial)
    }

    return (
        <path
            id={id}
            d={`M${sourceX},${sourceY} L${targetX},${targetY}`}
            style={{
                strokeWidth: 2,
                stroke: 'white',
                markerEnd: markerEnd,  // Application du marqueur en fonction du type de relation
                strokeDasharray: data?.relationType === 'implementation' ? '5,5' : '0', // Ligne en tirets pour l'implémentation
            }}
        />
    );
};

export default CustomEdge;
