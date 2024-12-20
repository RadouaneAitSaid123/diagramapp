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
    let markerEnd = null;
    let markerStart = null;
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
            markerStart = 'url(#dashed-line)';
            markerEnd = 'url(#arrowhead)';
            break;
        case 'unidirectionnelle': // Navigabilité unidirectionnelle
            markerEnd = 'url(#unidirectional-arrowhead)';
            break;
        case 'bidirectional': // Navigabilité bidirectionnelle
            markerStart = 'url(#bidirectional-arrow-start)';
            markerEnd = 'url(#bidirectional-arrow-end)';
            break;

        default:
            markerEnd = null; // Association normale (aucun marqueur spécial)
    }

    // Récupérer les cardinalités
    const sourceCardinality = data?.sourceCardinality || '';
    const targetCardinality = data?.targetCardinality || '';

    console.log("Source Cardinality:", sourceCardinality);
    console.log("Target Cardinality:", targetCardinality);


    return (
        <>
            <path
                id={id}
                d={`M${sourceX},${sourceY} L${targetX},${targetY}`}
                style={{
                    strokeWidth: 2,
                    stroke: 'black',
                    markerStart: markerStart,  // Applique le marqueur de départ pour la relation bidirectionnelle
                    markerEnd: markerEnd,
                    strokeDasharray: data?.relationType === 'implementation' ? '5,5' : '0', // Ligne en tirets pour l'implémentation
                }}
            />


            {/* Cardinalité côté source */}
            <text
                x={sourceX - 20}
                y={sourceY + 15}
                fill="black"
                fontSize={30}
                textAnchor="middle"
            >
                {sourceCardinality}
            </text>
            {/* Cardinalité côté cible */}
            <text
                x={targetX + 20}
                y={targetY -10}
                fill="black"
                fontSize={30}
                textAnchor="middle"
            >
                {targetCardinality}
            </text>

        </>
    );
};

export default CustomEdge;
