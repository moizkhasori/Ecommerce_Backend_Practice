export const TryCatch = (givenFn) => (req,res,next) => {
    Promise.resolve(givenFn(req,res,next)).catch(next)
}

