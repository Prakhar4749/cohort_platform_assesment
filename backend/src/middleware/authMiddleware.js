

export const authenticate = (req, res, next) => {
    console.log("Authentication middleware triggered");
    next(); // Move to the next middleware/controller
};
