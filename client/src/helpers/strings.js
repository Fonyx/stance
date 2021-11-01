
/**
 * Convert a spacious string to a slug string - reversal of spacious
 * @param {*} spacious 
 * @returns 
 */
export function slugify(spacious){
    let slug = spacious.replace(/\s/g, '-');
    return slug
}

/**
 * Convert a slug string to a spacious string - reversal of slugify
 * @param {*} slug 
 * @returns 
 */
export function spacious(slug){
    let spacious = slug.replace(/-/g, '/s');
    return spacious
}