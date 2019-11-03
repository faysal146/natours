// higer order function take another function
module.exports = fn => {
    // return the function and express call the function with req,res,next argument
    return (req, res, next) => {
        // pass to req,res,next to our function
        // apply catch
        fn(req, res, next).catch(next);
    };
};
