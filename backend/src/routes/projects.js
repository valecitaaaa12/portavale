const router = require("express").Router();
const pool = require("../db/pool");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, description, tech, url, repo_url, image FROM projects ORDER BY id ASC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
