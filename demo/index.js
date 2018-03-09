document.addEventListener('DOMContentLoaded', function() {
    // Instantiate vis and its parameters
    const vis = pv.vis.template()
        .id(d => d.id)
        .label(d => d.label);

    // Make the vis responsive to window resize
    window.onresize = _.throttle(update, 100);

    // Data
    let data;
    d3.json('../data/sample.json').then(json => {
        data = json;

        // Build the vis
        update();
    });

    /**
     * Updates vis when window changed.
     */
    function update() {
        // Update size of the vis
        vis.width(window.innerWidth)
            .height(window.innerHeight);

        // Update size of the vis container and redraw
        d3.select('.pv-vis-demo')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .datum(data)
            .call(vis);
    }
});