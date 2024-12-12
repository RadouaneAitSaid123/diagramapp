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
            </defs>
        </svg>
    );
}

export default SVGDefs;
