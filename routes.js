import express from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import asyncHandler from 'express-async-handler'

import authMiddleware from './middlewares/authMiddleware'
import authController from './controllers/authController'
import userController from './controllers/userController'
import projectController from './controllers/projectController'
import blueprintController from './controllers/blueprintController'
import collaborationController from './controllers/collaborationController'
import exportController from './controllers/exportController'

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}

function authRoutes(app) {
  const router = express.Router()

  router.post(
    '/register',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      })
    }),
    asyncHandler(authController.register)
  )

  router.post(
    '/login',
    celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    }),
    asyncHandler(authController.login)
  )

  router.post(
    '/logout',
    authMiddleware,
    asyncHandler(authController.logout)
  )

  router.post(
    '/refresh-token',
    celebrate({
      [Segments.BODY]: Joi.object({
        refreshToken: Joi.string().required()
      })
    }),
    asyncHandler(authController.refreshToken)
  )

  router.post(
    '/forgot-password',
    celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required()
      })
    }),
    asyncHandler(authController.forgotPassword)
  )

  router.post(
    '/reset-password',
    celebrate({
      [Segments.BODY]: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required()
      })
    }),
    asyncHandler(authController.resetPassword)
  )

  app.use('/auth', router)
}

function userRoutes(app) {
  const router = express.Router()

  router.use(authMiddleware)

  router.get(
    '/me',
    asyncHandler(userController.getCurrentUser)
  )

  router.put(
    '/me',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional()
      }).min(1)
    }),
    asyncHandler(userController.updateCurrentUser)
  )

  router.get(
    '/',
    authorizeRoles('admin'),
    asyncHandler(userController.getAllUsers)
  )

  router.get(
    '/:userId',
    authorizeRoles('admin'),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        userId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(userController.getUserById)
  )

  router.put(
    '/:userId',
    authorizeRoles('admin'),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        userId: Joi.string().uuid().required()
      }),
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('user','admin').optional()
      }).min(1)
    }),
    asyncHandler(userController.updateUser)
  )

  router.delete(
    '/:userId',
    authorizeRoles('admin'),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        userId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(userController.deleteUser)
  )

  app.use('/users', router)
}

function projectRoutes(app) {
  const router = express.Router()

  router.use(authMiddleware)

  router.get(
    '/',
    asyncHandler(projectController.getAllProjects)
  )

  router.get(
    '/:projectId',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        projectId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(projectController.getProjectById)
  )

  router.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional()
      })
    }),
    asyncHandler(projectController.createProject)
  )

  router.put(
    '/:projectId',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        projectId: Joi.string().uuid().required()
      }),
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional()
      }).min(1)
    }),
    asyncHandler(projectController.updateProject)
  )

  router.delete(
    '/:projectId',
    authorizeRoles('admin'),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        projectId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(projectController.deleteProject)
  )

  app.use('/projects', router)
}

function blueprintRoutes(app) {
  const router = express.Router({ mergeParams: true })

  router.use(
    celebrate({
      [Segments.PARAMS]: Joi.object({
        projectId: Joi.string().uuid().required()
      })
    })
  )
  router.use(authMiddleware)

  router.get(
    '/',
    asyncHandler(blueprintController.getAllBlueprints)
  )

  router.post(
    '/',
    celebrate({
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
        data: Joi.object().required()
      })
    }),
    asyncHandler(blueprintController.createBlueprint)
  )

  router.get(
    '/:blueprintId',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        blueprintId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(blueprintController.getBlueprintById)
  )

  router.put(
    '/:blueprintId',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        blueprintId: Joi.string().uuid().required()
      }),
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        data: Joi.object().optional()
      }).min(1)
    }),
    asyncHandler(blueprintController.updateBlueprint)
  )

  router.delete(
    '/:blueprintId',
    authorizeRoles('admin'),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        blueprintId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(blueprintController.deleteBlueprint)
  )

  app.use('/projects/:projectId/blueprints', router)
}

function collaborationRoutes(app) {
  const router = express.Router({ mergeParams: true })

  router.use(
    celebrate({
      [Segments.PARAMS]: Joi.object({
        projectId: Joi.string().uuid().required()
      })
    })
  )
  router.use(authMiddleware)

  router.post(
    '/invite',
    authorizeRoles('admin'),
    celebrate({
      [Segments.BODY]: Joi.object({
        userId: Joi.string().uuid().required(),
        role: Joi.string().valid('viewer', 'editor').required()
      })
    }),
    asyncHandler(collaborationController.inviteCollaborator)
  )

  router.post(
    '/accept/:invitationId',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        invitationId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(collaborationController.acceptInvitation)
  )

  router.get(
    '/',
    asyncHandler(collaborationController.getCollaborators)
  )

  router.delete(
    '/:userId',
    authorizeRoles('admin'),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        userId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(collaborationController.removeCollaborator)
  )

  app.use('/projects/:projectId/collaborations', router)
}

function exportRoutes(app) {
  const router = express.Router({ mergeParams: true })

  router.use(
    celebrate({
      [Segments.PARAMS]: Joi.object({
        projectId: Joi.string().uuid().required()
      })
    })
  )
  router.use(authMiddleware)

  router.get(
    '/project',
    asyncHandler(exportController.exportProject)
  )

  router.get(
    '/blueprint/:blueprintId',
    celebrate({
      [Segments.PARAMS]: Joi.object({
        blueprintId: Joi.string().uuid().required()
      })
    }),
    asyncHandler(exportController.exportBlueprint)
  )

  app.use('/projects/:projectId/export', router)
}

export default function defineRoutes(app) {
  authRoutes(app)
  userRoutes(app)
  projectRoutes(app)
  blueprintRoutes(app)
  collaborationRoutes(app)
  exportRoutes(app)
}