(function () {

    sigma.classes.graph.addMethod('kruskal', function () {
        const sortedEdgesInGraph = returnSortedEdgesByWeight();

        const spanningTrees = [];

        const edgesInMinSpanningTreeIds = new Set();
        const nodesInSpanningTrees = new Set();

        initializeFirstTreeWithFirstEdge();

        for (let sortedEdgeIndex = 1; sortedEdgeIndex < sortedEdgesInGraph.length; sortedEdgeIndex++) {
            const sourceNodeId = sortedEdgesInGraph[sortedEdgeIndex].source;
            const targetNodeId = sortedEdgesInGraph[sortedEdgeIndex].target;

            if (!nodesInSpanningTrees.has(sourceNodeId) &&
                !nodesInSpanningTrees.has(targetNodeId)) {
                addEdgeToNewSpanningTree(sortedEdgesInGraph[sortedEdgeIndex]);
                continue;
            }

            for (let spanningTree of spanningTrees) {

                if (spanningTree.contains(sourceNodeId) && spanningTree.contains(targetNodeId)) {
                    break;
                }

                if (spanningTree.contains(sourceNodeId)) {

                    if (nodesInSpanningTrees.has(targetNodeId)) {
                        const spanningTreeWithTargetNode = returnSpanningTreeWithNodeId(targetNodeId);

                        spanningTreeWithTargetNode.traverseBFS(function (node) {
                            spanningTree.add(node.data, sourceNodeId)
                        });

                        edgesInMinSpanningTreeIds.add(sourceNodeId + "|" + targetNodeId);
                        spanningTrees.splice(spanningTrees.indexOf(spanningTreeWithTargetNode), 1);
                        break;

                    } else {
                        addEdgeToMinSpanningTreeAndVisitedNodes(sortedEdgesInGraph[sortedEdgeIndex]);
                        spanningTree.add(targetNodeId, sourceNodeId);
                    }
                    break;

                } else if (spanningTree.contains(targetNodeId)) {

                    if (nodesInSpanningTrees.has(sourceNodeId)) {
                        const spanningTreeWithSourceNode = returnSpanningTreeWithNodeId(sourceNodeId);

                        spanningTreeWithSourceNode.traverseBFS(function (node) {
                            spanningTree.add(node.data, targetNodeId)
                        });

                        edgesInMinSpanningTreeIds.add(sourceNodeId + "|" + targetNodeId);
                        spanningTrees.splice(spanningTrees.indexOf(spanningTreeWithSourceNode), 1);
                        break;

                    } else {
                        addEdgeToMinSpanningTreeAndVisitedNodes(sortedEdgesInGraph[sortedEdgeIndex]);
                        spanningTree.add(sourceNodeId, targetNodeId);
                    }
                    break;
                }
            }
        }

        return Array.from(edgesInMinSpanningTreeIds);

        function initializeFirstTreeWithFirstEdge() {
            const tree = new Tree();

            tree.add(sortedEdgesInGraph[0].source);
            tree.add(sortedEdgesInGraph[0].target, sortedEdgesInGraph[0].source);

            nodesInSpanningTrees.add(sortedEdgesInGraph[0].source);
            nodesInSpanningTrees.add(sortedEdgesInGraph[0].target);

            spanningTrees.push(tree);
            edgesInMinSpanningTreeIds.add(sortedEdgesInGraph[0].source + "|" + sortedEdgesInGraph[0].target);
        }

        function returnSpanningTreeWithNodeId(edge) {
            for (let spanningTree of spanningTrees) {
                if (spanningTree.contains(edge)) {
                    return spanningTree;
                }
            }
        }

        function addEdgeToMinSpanningTreeAndVisitedNodes(sortedEdges) {
            edgesInMinSpanningTreeIds.add(sortedEdges.source + "|" + sortedEdges.target);

            nodesInSpanningTrees.add(sortedEdges.source);
            nodesInSpanningTrees.add(sortedEdges.target);
        }

        function addEdgeToNewSpanningTree(edge) {
            const tree = new Tree();

            tree.add(edge.source);
            tree.add(edge.target, edge.source);

            nodesInSpanningTrees.add(edge.source);
            nodesInSpanningTrees.add(edge.target);

            spanningTrees.push(tree);
            edgesInMinSpanningTreeIds.add(edge.source + "|" + edge.target);
        }
    });
}).call(window);