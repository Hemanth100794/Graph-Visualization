import React, { useEffect, useRef, useState } from "react";
import { GraphGenerator } from "./GraphGenerator";
import styles from "./GraphGenerator.module.css";
import * as d3 from "d3";

export function GraphUpdater() {
    const containerRef = useRef(null);
    const textAreaRef = useRef(null);
    const [data, setData] = useState();
    const [errorMessage, setError] = useState("")


    const checkIfLinkNodesExists =(nodes,sourceId,targetId) => {
        let isSourceNodeExist=false;
        let isTargetNodeExist =false;
        nodes.forEach(node =>{
            if(node.id === sourceId) {
                isSourceNodeExist=true;
            } else if(node.id === targetId) {
                isTargetNodeExist=true;
            }
        })
     return isSourceNodeExist && isTargetNodeExist
}

    useEffect(() => {
        if (containerRef.current) {
            GraphGenerator(containerRef.current, data.edges, data.vertices);
        }
    }, [data]);

    const setVisualizationData = () => {
        var rawData = JSON.parse(JSON.stringify(textAreaRef.current.value));
        let formattedData = {
            vertices: [],
            edges: []
        };
        var data = JSON.parse(rawData)
        if (data.vertices && data.vertices.length > 0) {
            data.edges && data.edges.forEach(edge => {
                const { target_id, source_id, ...rest } = edge;
                if (checkIfLinkNodesExists(data.vertices,source_id,target_id)) {
                   formattedData.edges.push({ ...rest, target: target_id, source: source_id })
                }
            })
            formattedData.vertices = data.vertices;
        }
        // Valiidate Json Data  
         if(formattedData.vertices.length === 0) {
             setError("Invalid vertices data in input")
         } else if(formattedData.edges.length === 0) {
             setError("Invalid Edges data in input")
         }
        d3.select("svg").remove();
        setData(formattedData);
    }

    return (
    <div style={{ display: "flex" }}>
        <div className={styles.jsonInput}>
            <button onClick={setVisualizationData}>Generate Visualization</button>
            {errorMessage && <span className="error-span-message">{errorMessage}</span>}
            <textarea ref={textAreaRef} className={styles.rawInput} placeholder="PLease enter a valid JSON for visualization" />
        </div>
        {data && <div ref={containerRef} className={styles.container} />}
    </div>)
}
