https://codingwithspike.wordpress.com/2018/03/10/making-settimeout-an-async-await-function/

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
        resolve('resolved');
        }, ms);
    });
}

module.exports = wait;