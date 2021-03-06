define(['underscore','backbone', 'models/Shape', 'backbone-localStorage'], function(_, Backbone, Shape){
	var Shapes = Backbone.Collection.extend({
		model: Shape,
		url: 'shapes',
		localStorage: new Store("shapes"),

		/**
		 * Sorting method
		 * @param model
		 * @returns Number
		 */
		comparator: function(model) {
			return model.get('ordering');
		},

		addRaphaelElement: function(element){
			var self = this;
			var data = {
					attributes    : element.attrs,
					type          : element.type,
					classList     : element.node.classList ? Array.prototype.slice.call(element.node.classList) : '',
					transform     : element.transform || {}
			};

			var shape = new Shape(data);

			this.add(shape);

			return shape.save(data);
		},

		changeShapesOrder: function(currentId, front){
			var self              = this;
			var currentOrdering   = this.get(currentId).get('ordering');

			this.each(function(shape){
				var shapeId         = shape.get('id');
				var ordering        = shape.get('ordering');

				// Update shape ordering
				if(shapeId == currentId){
					shape.set('ordering', front ? self.length - 1 : 0);
				}else if(front && ordering >= currentOrdering){
					shape.set('ordering', ordering - 1);
				}else if(!front && ordering <= currentOrdering){
					shape.set('ordering', ordering + 1);
				}

				shape.save();
			});

			return this;
		}
	});

	return Shapes;
});