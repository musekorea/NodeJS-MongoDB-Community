export const homeController = (req, res) => {
  return res.status(200).render(`index.ejs`);
};
