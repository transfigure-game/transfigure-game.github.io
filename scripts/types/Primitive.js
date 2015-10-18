Primitive = {};

Primitive.is = function(value) {
	var type = typeof value;
	
	return arg == null || (type != 'object' && type != 'function');
}