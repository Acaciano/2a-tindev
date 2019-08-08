const axios = require('axios');
const devModel = require('../models/dev');

module.exports = {

   async index(req, res ){
    const { user } = req.headers;
    const loggedDev = await devModel.findById(user);

    const users = await devModel.find({
        $and: [
            { _id: { $ne: user } },
            { _id: { $nin: loggedDev.likes } },
            { _id: { $nin: loggedDev.dislikes } }
        ]
    });

    return res.json(users);
   },
    
   async store(req, res) {
        const { username } = req.body;
        const userExists = await devModel.findOne({user: username});

        if(userExists) { return res.json(userExists); }

        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { name, bio, avatar_url: avatar} = response.data;

        await devModel.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(response.data);
   }
};