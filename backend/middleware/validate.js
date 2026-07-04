function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join(".") || "body"}: ${issue.message}`
      );
      return res.status(400).json({ message: messages.join("; ") });
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;
