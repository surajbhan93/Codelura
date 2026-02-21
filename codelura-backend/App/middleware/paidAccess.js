export const paidAccess = async (req, res, next) => {
  const course = req.course;

  if (!course.isPaid) return next();

  const hasAccess = req.user.purchasedCourses.includes(course._id);

  if (!hasAccess) {
    return res.status(403).json({
      message: "Please purchase this course"
    });
  }

  next();
};
