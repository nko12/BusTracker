
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

/**
 * Given two arrays, determines if they are equal to each other (have all the same items in the same order).
 * @param arr1 The first array to compare.
 * @param arr2 The second array to compare.
 * @returns True if the two arrays are equal, otherwise false.
 */
export function arrayEquals(arr1: Array<any>, arr2: Array<any>): boolean {

    if (!arr1 && !arr2)
        return true;
    if(!arr1 && arr2 || arr1 && !arr2)
        return false;
    if (arr1.length != arr2.length)
        return false;

    for (let i: number = 0, l: number = arr1.length; i < l; i++) {

        // Check for nested arrays.
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // Recurse the nested arrays.
            if (!arrayEquals(arr1[i], arr2[i])) {
                return false;
            }
        } else if (arr1[i] != arr2[i]) {
            // These two non-array objects are not equal.
            return false;
        }
    }
    return true;
}