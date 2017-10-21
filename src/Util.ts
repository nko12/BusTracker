
/**
 * Given two objects, copies properties from source to destination where the property is common to both source and property.
 * @param source The source object to copy from.
 * @param output The destination object to copy to.
 */
export function copyInCommonProperties(source: any, dest: any) {
    for (var prop in dest) {
        if (dest.hasOwnProperty(prop) && source.hasOwnProperty(prop)) {
            dest[prop] = source[prop];
        }
    }
}