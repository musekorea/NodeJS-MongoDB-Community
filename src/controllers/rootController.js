export const homeController = (req, res) => {
  return res.status(200).render(`index.ejs`);
};

export const errorController = (req, res) => {
  return res.status(400).render(`400page.ejs`);
};
