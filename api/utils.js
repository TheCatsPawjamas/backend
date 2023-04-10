async function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
}

async function requireAdmin(req, res, next) {
  console.log(req.user)
  if (req.user.admin==false) {
    next({
      name: "MissingAdminStatusError",
      message: "You must be have admin status to perform this action"
    });
  }

  next();
}

module.exports = {requireUser, requireAdmin};