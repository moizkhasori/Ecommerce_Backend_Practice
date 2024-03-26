import { ErrorHandler } from "./ErrorHandler.js"

export const avaliableStatusOptionsToChooseFrom = (currentStatus) => {

    try {
        const statuses = ["pending", "confirmed", "dispatched" ,"delivered"]

        const currentStatusIndex = statuses.indexOf(currentStatus)
        
        if(currentStatusIndex === -1){
            throw new ErrorHandler("Invalid Status Provided!", 400)
        }

        return statuses.splice(currentStatusIndex+1)


    } catch (error) {
        throw error;   
    }

}

export const isUserStatusValidfn = (userStatus) => {
    const statuses = ["pending", "confirmed", "dispatched" ,"delivered"]
    const userStatusIndex = statuses.indexOf(userStatus)
    
    if(userStatusIndex === -1){
        return false;
    }
    return true
}
