export const getJoinController = (req, res) => {
  return res.status(200).render('join.ejs');
};

export const postJoinController = (req, res) => {
  console.log(req.body);
};
