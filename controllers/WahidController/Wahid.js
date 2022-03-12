const Wahid = require("../../models/Wahid");

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

const WahidReq = (data) => {
  const WahidKeys = [
    "first_name",
    "last_name",
    "email",
    "phone_no",
  ];

  const wahidObject = {};

  WahidKeys.forEach((currKey) => {
    if (data[currKey] !== undefined) {
      wahidObject[currKey] = data[currKey];
    }
  });

  return wahidObject;
};

 module.exports = {

  getAllWahid: (req, res) => {
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
    Wahid.findAndCountAll({
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

  updateWahidById: (req,res)=>{
    const {id} = req.params;
    const formatWahid = WahidReq(req.body)
    Wahid.findByPk(id).then((value)=> {
      if(!value){
          throw new Error("Invalid Id");
        }
        value.update(formatWahid)
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

  deleteWahidById: (req,res)=>{
    const {id} = req.params;
    Wahid.findByPk(id).then((value)=> {
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

  WahidGetById: (req,res)=>{
    Wahid.findOne({where:{id: req.params.id}}).then((value)=> {
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

  saveWahid: (req, res) => {
    const formatWahid = WahidReq(req.body);
    const {email} = req.body;
    Wahid.findOne({
        where: {
        email: { $eq: email, $not: null }
      }
      }).then((currUser)=>{
        if(currUser){
          return res.status(200).json({
            message: "Email already registered."
          });
        }
        Wahid.create(formatWahid)
      .then((value) => {
        res.status(200).json({
          message: "Wahid Saved successfully",
          data: value,
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
