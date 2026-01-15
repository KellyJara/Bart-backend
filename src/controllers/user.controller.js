export const createUser = async (req, res) => {
    const {username, email, password} = req.body;
    console.log(req.body);
    res.json({message: 'User Created'});
}