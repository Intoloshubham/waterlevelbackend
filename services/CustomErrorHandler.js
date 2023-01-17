
class CustomErrorHandler extends Error{
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }
    
    static alreadyExist(message){
        return new CustomErrorHandler(409, message)
    }

    static wrongCredentials(message = 'Username & password is wrong!'){
        return new CustomErrorHandler(401, message)
    }
    
    static unAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message);
    }

    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message);
    }

    static inValid(message) {
        return new CustomErrorHandler(406, message);
    }

    static notExist(message){
        return new CustomErrorHandler(401, message)
    }

    static idUndefined(message){
        return new CustomErrorHandler(401, message)
    }

    

    

    // static paymentNotVerify(message){
    //     return new CustomErrorHandler(403, message)
    // }

}

export default CustomErrorHandler;