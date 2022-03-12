const User = require("../../models/User");
const {jwtTokens} = require('../../utils/jsonWebToken/jwt');

const getPagination = (page, size) => {
	const limit = size ? +size : 100;
	const offset = page ? page * limit : 0;
	return { limit, offset };
};

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: Data } = data;
	const currentPage = page ? +page : 0;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, Data, totalPages, currentPage };
};

const UserReq = (data) => {
  const UserKeys = [
    "first_name",
    "last_name",
    "email",
    "phone_no",
  ];

  const userObject = {};

  UserKeys.forEach((currKey) => {
    if (data[currKey] !== undefined) {
      userObject[currKey] = data[currKey];
    }
  });

  return userObject;
};

 module.exports = {

  getAllUser: (req, res) => {
    const {
			page = 0,
			size = 100,
			...searchParams
		} = req.query;
		const { limit, offset } = getPagination(page, size);
		let where = {};

		Object.entries(searchParams).forEach(([key, value]) => {
			if (key && value) where = { ...where, [key]: { $like: `%${value}%` } };
		})
    User.findAndCountAll({
      where,
			order: [['id', 'DESC']],
			limit,
			offset,
    })
      .then((value) => {
        const response = getPagingData(value, page, limit);
				res.status(200).json(response);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: err.message || "Error in getting Data" });
      });
  },

  updateUserById: (req,res)=>{
    const {id} = req.params;
    const formatUser = UserReq(req.body)
    User.findByPk(id).then((value)=> {
      if(!value){
          throw new Error("Invalid Id");
        }
        value.update(formatUser)
      res.status(200).json({
        message: "Updated Successfully",
        data: value
      })
    }).catch((err) => {
        res.status(500).json({
          message: err.message || "Error in updating Data",
        });
      });
  },

  deleteUserById: (req,res)=>{
    const {id} = req.params;
    User.findByPk(id).then((value)=> {
      if(!value){
          throw new Error("Invalid Id");
        }
        value.destroy()
      res.status(200).json({
        message: " Deleted Successfully",
      })
    }).catch((err) => {
        res.status(500).json({
          message: err.message || "Error in deleting Data",
        });
      });
  },

  userGetById: (req,res)=>{
    User.findOne({where:{id: req.params.id}}).then((value)=> {
      if(!value){
          throw new Error(" Invalid  Id");
        }
      res.status(200).json({
        message: "Fetched data Successfully",
        data: value
      })
    }).catch((err) => {
        res.status(500).json({
          message: err.message || "Error in fetching Data",
        });
      });
  },

  saveUser: (req, res) => {
    const formatUser = UserReq(req.body);
    const {email} = req.body;
    User.findOne({
        where: {
        email: { $eq: email, $not: null }
      }
      }).then((currUser)=>{
        if(currUser){
          return res.status(200).json({
            message: "Email already registered."
          });
        }
        User.create(formatUser)
      .then((value) => {
        const token = jwtTokens(value)
        res.status(200).json({
          message: "Wahid Saved successfully",
          data: value,
          token: token
        });
      })
      .catch((err) => {
          console.log(err)
        res
          .status(500)
          .json({ message: err.message || "Error in Saving Data" });
      });
    }).catch((err)=> {
      console.log(err)
        res
          .status(500)
          .json({ message: err.message || "Error in Fetching Data" });
    })
  },
};
