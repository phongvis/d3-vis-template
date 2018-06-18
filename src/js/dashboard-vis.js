/**
 * A template for a visualization.
 */
pv.vis.template = function() {
    /**
     * Visual configs.
     */
    const margin = { top: 40, right: 10, bottom: 10, left: 10 };

    let visWidth = 960, visHeight = 600, // Size of the visualization, including margins
        width, height, // Size of the main content, excluding margins
        visTitle = 'Vis Title';

    /**
     * Accessors.
     */
    let id = d => d.id,
        label = d => d.label;

    /**
     * Data binding to DOM elements.
     */
    let data,
        dataChanged = true; // True to redo all data-related computations

    /**
     * DOM.
     */
    let visContainer, // Containing the entire visualization
        itemContainer;

    /**
     * D3.
     */
    const listeners = d3.dispatch('click');

    /**
     * Main entry of the module.
     */
    function module(selection) {
        selection.each(function(_data) {
            // Initialize
            if (!this.visInitialized) {
                const container = d3.select(this).append('g').attr('class', 'pv-template');
                visContainer = container.append('g').attr('class', 'main-vis');
                itemContainer = visContainer.append('g').attr('class', 'items');

                addSettings(container);

                this.visInitialized = true;
            }

            data = _data;
            update();
        });

        dataChanged = false;
    }

    /**
     * Updates the visualization when data or display attributes changes.
     */
    function update() {
        // Canvas update
        width = visWidth - margin.left - margin.right;
        height = visHeight - margin.top - margin.bottom;

        visContainer.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        /**
         * Computation.
         */
        // Updates that depend only on data change
        if (dataChanged) {

        }

        // Updates that depend on both data and display change
        computeLayout(data);

        /**
         * Draw.
         */
        pv.enterUpdate(data, itemContainer, enterItems, updateItems, id, 'item');
    }

    /**
     * Called when new items added.
     */
    function enterItems(selection) {
        const container = selection
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
            .attr('opacity', 0)
            .on('click', function(d) {
                listeners.call('click', this, d);
            });

        container.append('circle')
            .attr('r', 12);

        container.append('text')
            .text(label);
    }

    /**
     * Called when items updated.
     */
    function updateItems(selection) {
        selection.each(function(d) {
            const container = d3.select(this);

            // Transition location & opacity
            container.transition()
                .attr('transform', 'translate(' + d.x + ',' + d.y + ')')
                .attr('opacity', 1);
        });
    }

    /**
     * Computes the position of each item.
     */
    function computeLayout(data) {
        data.forEach(d => {
            d.x = Math.random() * width;
            d.y = Math.random() * height;
        });
    }

    function addSettings(container) {
        container = container.append('foreignObject').attr('class', 'settings')
            .attr('width', '100%')
            .append('xhtml:div').attr('class', 'vis-header');

        // Title
        container.append('xhtml:div').attr('class', 'title').text(visTitle);
    }

    /**
     * Sets/gets the width of the visualization.
     */
    module.width = function(value) {
        if (!arguments.length) return visWidth;
        visWidth = value;
        return this;
    };

    /**
     * Sets/gets the height of the visualization.
     */
    module.height = function(value) {
        if (!arguments.length) return visHeight;
        visHeight = value;
        return this;
    };

    /**
     * Sets/gets the title of the visualization.
     */
    module.visTitle = function(value) {
        if (!arguments.length) return visTitle;
        visTitle = value;
        return this;
    };

    /**
     * Sets/gets the unique id accessor.
     */
    module.id = function(value) {
        if (!arguments.length) return id;
        id = value;
        return this;
    };

    /**
     * Sets/gets the label accessor.
     */
    module.label = function(value) {
        if (!arguments.length) return label;
        label = value;
        return this;
    };

    /**
     * Sets the flag indicating data input has been changed.
     */
    module.invalidate = function() {
        dataChanged = true;
    };

    /**
     * Binds custom events.
     */
    module.on = function() {
        const value = listeners.on.apply(listeners, arguments);
        return value === listeners ? module : value;
    };

    return module;
};