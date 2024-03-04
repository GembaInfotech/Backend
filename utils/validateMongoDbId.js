import mongoose from "mongoose";
const validateId = (id)=>{
    const isValid= mongoose.Types.ObjectId.isValid(id);
    if(!isValid){
        resizeBy.json({"error":"Invalid Id"});

    }


}

export {validateId}; 