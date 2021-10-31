export function slugify(spacious){
    let slug = spacious.replace(/\s/g, '-');
    return slug
}