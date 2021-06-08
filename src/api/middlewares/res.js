export default (req, res, next) => {
    res.sendResponse = ({ status, data }) => {
        return res.status(status).json(data);
    }

    next();
};