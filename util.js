export function wait(ms) {
    return new Promise((resolve, reject) => {
        const ref = setTimeout(() => {
            ref.unref();
            resolve(true);
        }, ms);
    })
}