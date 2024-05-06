export function nestedMerge(target, source) {
	if(!source) return target;
	for(const key in source) {
		if(source[ key ] && typeof source[ key ] === "object" && !Array.isArray(source[ key ])) {
			target[ key ] = nestedMerge(target[ key ] || {}, source[ key ]);
		} else {
			target[ key ] = source[ key ];
		}
	}
	return target;
};

export default {
	nestedMerge,
};