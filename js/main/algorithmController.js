let algorithmSelected = "dijkstra";

function showDijkstraInputBoxes() {
    if (algorithmSelected === 'kruskal') {
        $("#button-block").animate({top: '+70px'});
    }
    document.getElementById("source-holder").style.visibility = "visible";

    $(".algo-chooser-highlight").removeClass("algo-chooser-highlight");
    $('#dijkstra-option').addClass('algo-chooser-highlight');
    algorithmSelected = "dijkstra";
}

function showKruskalInputBoxes() {
    if (algorithmSelected !== 'kruskal') {
        $("#button-block").animate({top: '-8px'});
    }
    document.getElementById("source-holder").style.visibility = "hidden";

    $(".algo-chooser-highlight").removeClass("algo-chooser-highlight");
    $('#kruskal-option').addClass('algo-chooser-highlight');

    algorithmSelected = "kruskal";
}

function showPrimsInputBoxes() {
    if (algorithmSelected === 'kruskal') {
        $("#button-block").animate({top: '+70px'});
    }
    document.getElementById("source-holder").style.visibility = "visible";

    $(".algo-chooser-highlight").removeClass("algo-chooser-highlight");
    $('#prim-option').addClass('algo-chooser-highlight');

    algorithmSelected = "prim";
}

function showPlayButton() {
    document.getElementById("pause-button").style.display = "none";
    document.getElementById("play-button").style.display = "inline";
}

function showPauseButton() {
    if (localStorage.getItem("algorithm")) {
        document.getElementById("play-button").style.display = "none";
        document.getElementById("pause-button").style.display = "inline";
    }
}

function executedSelectedAlgorithm() {
    event.preventDefault();

    if (s.graph.nodes().length === 0) {
        $.iGrowl({
            type: "growler-settings",
            message: "There a no nodes on the screen! Please add some",
            placement: {
                x: 'center'
            }
        });
        return;
    }

    if (s.graph.edges().length === 0) {
        $.iGrowl({
            type: "growler-settings",
            message: "There a no edges on the screen! Please add some",
            placement: {
                x: 'center'
            }
        });
        return;
    }


    if (algorithmSelected === "dijkstra") {

        if (!validNodeId) {
            document.getElementById("source-error-message").style.display = "inline";
            validNodeId = false;
            return false;

        } else {

            if (!localStorage.getItem("dijkstra-summary-prompt")) {
                $("#algorithm-summary-holder").load("algorithm-summary.html");
                $("#prompt-text").text("Would you like to view a brief summary of Dijkstra's algorithm before executing?");
                $("#prompt-text").show();
                $("#answer-container").show();
                $("#guide-prompt").fadeIn(500);
                return;
            }

            resetInformation();
            validNodeId = true;
            clearColoredNodesAndEdges();
            calculateDijkstraPath();
        }

    } else if (algorithmSelected === "kruskal") {

        if (!localStorage.getItem("kruskal-summary-prompt")) {
            $("#algorithm-summary-holder").load("algorithm-summary.html");
            $("#prompt-text").text("Would you like to view a brief summary of Kruskal's algorithm before executing?");
            $("#prompt-text").show();
            $("#answer-container").show();
            $("#guide-prompt").show();
            return;
        }

        resetInformation();
        validNodeId = true;
        clearColoredNodesAndEdges();
        calculateKruskalPath();

    } else if (algorithmSelected === "prim") {

        if (!localStorage.getItem("prim-summary-prompt")) {
            $("#algorithm-summary-holder").load("algorithm-summary.html");
            $("#prompt-text").text("Would you like to view a brief summary of Prim's algorithm before executing?");
            $("#prompt-text").show();
            $("#answer-container").show();
            $("#guide-prompt").fadeIn(500);
            return;
        }

        if (!validNodeId) {
            document.getElementById("source-error-message").style.display = "inline";
            validNodeId = false;
            return false;
        } else {
            resetInformation();
            validNodeId = true;
            clearColoredNodesAndEdges();
            calculatePrimsPath();
        }
    }

    return false;
}

function calculateDijkstraPath() {
    localStorage.setItem("algorithm", "dijkstra");

    const srcNodeId = getNodeIdFromLabel($("#src-node").val());

    const path = s.graph.dijkstra(srcNodeId);

    if (path === undefined || path.length === 0) {
        $.iGrowl({
            type: "growler-settings",
            message: "No path was returned from Dijkstra's algorithm!",
            placement: {
                x: 'center'
            }
        });
        return;
    } else {
        $("#helper-text-container").fadeIn();
        executeDijkstraTeacher(path);

        $('#slide-revealer').slideReveal("hide");
        document.getElementById("play-button").style.display = "inline";
        document.getElementById("pause-button").style.display = "none";
    }

    return path;
}

function calculateKruskalPath() {
    localStorage.setItem("algorithm", "kruskal");

    const idsOfMinSpanningTreeEdges = s.graph.kruskal();

    if (idsOfMinSpanningTreeEdges === undefined ||
        idsOfMinSpanningTreeEdges.length === 0) {

        $.iGrowl({
            type: "growler-settings",
            message: "No path was returned from Dijkstra's algorithm!",
            placement: {
                x: 'center'
            }
        });
    } else {
        $("#helper-text-container").fadeIn();
        executeKruskalTeacher(idsOfMinSpanningTreeEdges);

        $('#slide-revealer').slideReveal("hide");
        document.getElementById("play-button").style.display = "inline";
        document.getElementById("pause-button").style.display = "none";
    }

    return idsOfMinSpanningTreeEdges;
}

function calculatePrimsPath() {
    localStorage.setItem("algorithm", "prim");

    const srcNodeId = getNodeIdFromLabel($("#src-node").val());
    const edgesWithMinSpanTreeFlag = s.graph.prims(srcNodeId);

    if (edgesWithMinSpanTreeFlag === undefined ||
        edgesWithMinSpanTreeFlag.length === 0) {

        $.iGrowl({
            type: "growler-settings",
            message: "No path was returned from Dijkstra's algorithm!",
            placement: {
                x: 'center'
            }
        });
    } else {
        $("#helper-text-container").fadeIn();
        executePrimsTeacher(edgesWithMinSpanTreeFlag);

        $('#slide-revealer').slideReveal("hide");
        document.getElementById("play-button").style.display = "none";
        document.getElementById("pause-button").style.display = "inline";
    }

    return edgesWithMinSpanTreeFlag;
}

function enterKeyHandler() {
    if (event.keyCode === 13) {
        executedSelectedAlgorithm()
    }
}

function resetInformation() {
    $("#helper-text-container").empty();
}