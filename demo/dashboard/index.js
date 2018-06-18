document.addEventListener('DOMContentLoaded', async function() {
    // Instantiate vis and its parameters
    const vis = pv.vis.template()
        .visTitle('A Dashboard View')
        .id(d => d.id)
        .label(d => d.label);

    // Make the vis responsive to window resize
    window.onresize = _.throttle(update, 100);

    // Data
    let data = await d3.json('../../data/sample.json');

    // Build the vis
    update();

    /**
     * Updates vis when window changed.
     */
    function update() {
        // Update size of the vis
        let rect = pv.getContentRect(document.querySelector('.pv-vis-demo'));
        vis.width(rect[0]).height(rect[1]);

        // Update size of the vis container and redraw
        d3.select('.pv-vis-demo')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .datum(data)
            .call(vis);
    }
});