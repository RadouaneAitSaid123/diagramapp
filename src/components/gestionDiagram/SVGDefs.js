function SVGDefs() {
    return (
        <svg width="2px" height="0">
            <defs>
                {/* Héritage (flèche pleine) */}
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                </marker>

                {/* Agrégation faible (losange vide) */}
                <marker
                    id="diamond-empty"
                    markerWidth="10"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                >
                    <polygon points="0,5 5,0 10,5 5,10" fill="none" stroke="white" strokeWidth="1" />
                </marker>

                {/* Agrégation forte (losange plein) */}
                <marker
                    id="diamond-filled"
                    markerWidth="10"
                    markerHeight="10"
                    refX="10"
                    refY="5"
                    orient="auto"
                >
                    <polygon points="0,5 5,0 10,5 5,10" fill="white" />
                </marker>

                {/* Flèche unidirectionnelle (flèche pleine) */}
                <marker
                    id="unidirectional-arrowhead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="8"
                    refY="4"
                    orient="auto"
                >
                    <polyline points="0,0 8,4 0,8" fill="none" stroke="white" strokeWidth="1.5" />
                </marker>

                {/* Flèche bidirectionnelle (flèches aux deux extrémités) */}
                <marker
                    id="bidirectional-arrow-start"
                    markerWidth="8"
                    markerHeight="8"
                    refX="0"
                    refY="4"
                    orient="auto"
                >
                    <polyline points="8,0 0,4 8,8" fill="none" stroke="white" strokeWidth="1.5" />
                </marker>
                <marker
                    id="bidirectional-arrow-end"
                    markerWidth="8"
                    markerHeight="8"
                    refX="8"
                    refY="4"
                    orient="auto"
                >
                    <polyline points="0,0 8,4 0,8" fill="none" stroke="white" strokeWidth="1.5" />
                </marker>
            </defs>
        </svg>
    );
}

export default SVGDefs;
