
// this is higher order syntax 
const asyncHandler = (requestHandler)=>{
     (req,res,next) => {
          Promise.resolve(requestHandler(req,res,next)).
          catch((err)=> next(err))
     }
} 


     export {asyncHandler}


     // *** This is try catch function  

     // const asyncHandler = (fn)=> async (req,res,next)=>{   // this is a wrapper fn which will help 
     //      try {
     //           await fn(req,res,next)
     //      } catch (error) {
     //           res.status(err.code || 500).json({
     //                success: false,
     //                message:err.message
     //           })
     //      }
     // }


     // higher order functions
     // const asyncHandler = () => {}
     // const asyncHandler = (func) => {()=> {}}
     // const asyncHandler = (fn)=> async() => {}
