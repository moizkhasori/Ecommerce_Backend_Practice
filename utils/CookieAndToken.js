
export const generateTokenAndSendCookie = (user, statusCode, message, res) => {

    const token = user.getJwtToken();

    res.status(statusCode).cookie("token", token).json({
        success: true,
        message,
        user,
    })

}