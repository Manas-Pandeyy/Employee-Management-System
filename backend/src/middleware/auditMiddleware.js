const AuditLog = require("../models/AuditLog");

const audit = (action, entity) => async (req, res, next) => {
  const originalJson = res.json;
  res.json = async function (body) {
    if (res.statusCode < 400 && req.user) {
      await AuditLog.create({
        actor: req.user._id,
        action,
        entity,
        entityId: req.params.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent")
      }).catch(() => {});
    }
    return originalJson.call(this, body);
  };
  next();
};

module.exports = audit;
