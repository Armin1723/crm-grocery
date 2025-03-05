const { z } = require("zod");

  const addCompanySchema = z.object({
    name: z.string().min(2).max(255),
    description: z.string().max(1000).optional(),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/),
    address: z.string().max(500),
    logo: z.any().optional(), // Handled via multer
  });

  const updateCompanySchema =  z.object({
    name: z.string().min(2).max(255).optional(),
    description: z.string().max(1000).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/).optional(),
    address: z.string().max(500).optional(),
    logo: z.any().optional(),
  });

  const activateCompanySchema = z.object({
    isActive: z.boolean(),
  });

module.exports = {
    addCompanySchema,
    updateCompanySchema,
    activateCompanySchema,
};
