/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         displayName:
 *           type: string
 *         userName:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         secondaryEmail:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         country:
 *           type: string
 *         states:
 *           type: string
 *         zipCode:
 *           type: string
 *         profileImage:
 *           type: string
 *           default: 'https://ui-avatars.com/api/?name=User&background=ddd&color=555'
 *         googleId:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, seller, admin]
 *           default: user
 *         wishlist:
 *           type: array
 *           items:
 *             type: string
 *             description: Product ID references
 *         addresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               alias:
 *                 type: string
 *               details:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *         active:
 *           type: boolean
 *           default: true
 *         isVerified:
 *           type: boolean
 *         verificationCode:
 *           type: string
 *         verificationCodeExpiresAt:
 *           type: string
 *           format: date-time
 *         passwordResetToken:
 *           type: string
 *         passwordResetExpiresAt:
 *           type: string
 *           format: date-time
 *         passwordResetVerified:
 *           type: boolean
 *           default: false
 *         passwordChangedAt:
 *           type: string
 *           format: date-time
 *         emailVerificationExpires:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         seller:
 *           type: string
 *           description: User ID of the seller
 *         sku:
 *           type: string
 *         model:
 *           type: string
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         subCategory:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         brand:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         price:
 *           type: number
 *         priceAfterDiscount:
 *           type: number
 *         discountPercent:
 *           type: number
 *         quantity:
 *           type: number
 *         sold:
 *           type: number
 *         availability:
 *           type: string
 *           enum: [in stock, out of stock]
 *         ratingsAverage:
 *           type: number
 *         ratingsQuantity:
 *           type: number
 *         imageCover:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *         size:
 *           type: array
 *           items:
 *             type: string
 *         memory:
 *           type: array
 *           items:
 *             type: string
 *         weight:
 *           type: string
 *         storage:
 *           type: array
 *           items:
 *             type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         shippingInfo:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ChatMessage:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: The message to send to the chatbot
 *           minLength: 1
 *           maxLength: 500
 *       example:
 *         message: "What are your best selling smartphones?"
 *     ChatResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: string
 *           description: The chatbot's response
 *           example: "Our best selling smartphones are the iPhone 15 Pro, Samsung Galaxy S24 Ultra, and Google Pixel 8 Pro. Would you like to know more about any of these models?"
 *     ChatHistory:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "65f2d5e8c261e6001234abcd"
 *               message:
 *                 type: string
 *                 example: "What are your best selling smartphones?"
 *               reply:
 *                 type: string
 *                 example: "Our best selling smartphones are the iPhone 15 Pro, Samsung Galaxy S24 Ultra, and Google Pixel 8 Pro. Would you like to know more about any of these models?"
 * 
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * 
 * tags:
 *   - name: Auth
 *     description: User Authentication and Verification
 *   - name: Products
 *     description: Product Management
 *   - name: Categories
 *     description: Category Management
 *   - name: SubCategories
 *     description: SubCategory Management
 *   - name: Brands
 *     description: Brand Management
 *   - name: Users
 *     description: User Management (Admin only)
 *   - name: Orders
 *     description: Order Management
 *   - name: Reviews
 *     description: Product Reviews
 *   - name: Wishlist
 *     description: User Wishlist Management
 *   - name: Cart
 *     description: Shopping Cart Management
 *   - name: Address
 *     description: User Address Management
 *   - name: Coupon
 *     description: Coupon Management (Admin only)
 *   - name: Chat
 *     description: Chat bot API endpoints
 * 
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user and send a verification code email
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$
 *               confirmPassword:
 *                 type: string
 *                 description: must match user's password
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: User profile image upload
 *     responses:
 *       201:
 *         description: Verification code sent to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent to your email. Please verify your account.
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: User creation failed or email sending failed
 * 
 * /api/auth/verify-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify user's email with verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationCode
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: The 6-digit verification code sent to user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully. You can now log in.
 *       400:
 *         description: Invalid or expired verification code
 * 
 * /api/auth/resend-verificationCode:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend verification code to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification code resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent to your email.
 *       400:
 *         description: User already verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send verification code email
 * 
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful, returns user data and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Email not verified
 *       401:
 *         description: Incorrect email or password
 * 
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log out the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: logged out successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 * 
 * /api/auth/forget-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request password code link via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset code sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset code sent to your email.
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send password reset email
 * 
 * /api/auth/reset-password:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Reset user password using reset code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - password
 *               - confirmPassword
 *             properties:
 *               code:
 *                 type: string
 *                 description: Reset code received via email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your password has been reset successfully. You can now log in with your new password.
 *       400:
 *         description: Invalid password or reset token
 *       404:
 *         description: User not found
 * 
 * /api/auth/getMe:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 * 
 * /api/auth/updateMe:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               userName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               secondaryEmail:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *                 pattern: ^\+\d{7,15}$
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               states:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               zipCode:
 *                 type: string
 *                 pattern: ^[0-9]{5}(?:-[0-9]{4})?$
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     updatedEmail:
 *                       type: boolean
 *                     updatedSecondaryEmail:
 *                       type: boolean
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 * 
 * /api/auth/change-password:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 *       400:
 *         description: Invalid current password or new password
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 * 
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to select (comma-separated)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for category name
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: integer
 *                   description: Total number of categories
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       categoryImage:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryImage
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 description: Category name (will be converted to slug)
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: Category image file
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     categoryImage:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Category name already exists
 *
 * /api/categories/{categoryId}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a category by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     categoryImage:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Category not found
 *
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 description: Category name (will be converted to slug)
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: Category image file
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     categoryImage:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Category not found or name already exists
 *
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Category not found
 * 
 * /api/subcategories:
 *   get:
 *     tags:
 *       - SubCategories
 *     summary: Get all subcategories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to select (comma-separated)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for subcategory name
 *     responses:
 *       200:
 *         description: List of subcategories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: integer
 *                   description: Total number of subcategories
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
 *   post:
 *     tags:
 *       - SubCategories
 *     summary: Create a new subcategory (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 description: Subcategory name (will be converted to slug)
 *               category:
 *                 type: string
 *                 description: Category ID that this subcategory belongs to
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subcategory created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input data or subcategory name already exists
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *
 * /api/subcategories/{subcategoryId}:
 *   get:
 *     tags:
 *       - SubCategories
 *     summary: Get a subcategory by ID
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Subcategory not found
 *
 *   put:
 *     tags:
 *       - SubCategories
 *     summary: Update a subcategory (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 description: Subcategory name (will be converted to slug)
 *               category:
 *                 type: string
 *                 description: Category ID that this subcategory belongs to
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subcategory updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input data or subcategory name already exists
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Subcategory not found
 *
 *   delete:
 *     tags:
 *       - SubCategories
 *     summary: Delete a subcategory (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subcategory deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Subcategory not found
 * 
 * /api/brands:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get all brands
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to select (comma-separated)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for brand name
 *     responses:
 *       200:
 *         description: List of brands retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: integer
 *                   description: Total number of brands
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       subCategory:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
 *   post:
 *     tags:
 *       - Brands
 *     summary: Create a new brand (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 description: Brand name (will be converted to slug)
 *               category:
 *                 type: string
 *                 description: Category ID that this brand belongs to
 *               subCategory:
 *                 type: string
 *                 description: SubCategory ID that this brand belongs to
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Brand created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     subCategory:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Brand name already exists or Category/SubCategory not found
 *
 * /api/brands/{brandId}:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get a brand by ID
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     subCategory:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Brand not found
 *
 *   put:
 *     tags:
 *       - Brands
 *     summary: Update a brand (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *                 description: Brand name (will be converted to slug)
 *               category:
 *                 type: string
 *                 description: Category ID that this brand belongs to
 *               subCategory:
 *                 type: string
 *                 description: SubCategory ID that this brand belongs to
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Brand updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     subCategory:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Brand not found or name already exists or Category/SubCategory not found
 *
 *   delete:
 *     tags:
 *       - Brands
 *     summary: Delete a brand (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Brand deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Brand not found
 * 
 * /api/admin/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to select (comma-separated)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for name or email
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: integer
 *                   description: Total number of users
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       isVerified:
 *                         type: boolean
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *
 * /api/admin/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a specific user by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: User not found
 *
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user's role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: User not found
 *
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: User not found
 *
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to select (comma-separated)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for product name, tags, or description
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: integer
 *                   description: Total number of products
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product (Admin/Seller only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - category
 *               - imageCover
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               price:
 *                 type: number
 *               priceAfterDiscount:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *                 description: Category ID
 *               subCategory:
 *                 type: string
 *                 description: SubCategory ID
 *               brand:
 *                 type: string
 *                 description: Brand ID
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               size:
 *                 type: array
 *                 items:
 *                   type: string
 *               memory:
 *                 type: array
 *                 items:
 *                   type: string
 *               storage:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               shippingInfo:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin or seller)
 *
 * /api/products/my-products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get seller's products (Seller only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Fields to select (comma-separated)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for product name, tags, or description
 *     responses:
 *       200:
 *         description: List of seller's products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: integer
 *                   description: Total number of products
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin or seller)
 *
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product (Admin/Seller only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               price:
 *                 type: number
 *               priceAfterDiscount:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *                 description: Category ID
 *               subCategory:
 *                 type: string
 *                 description: SubCategory ID
 *               brand:
 *                 type: string
 *                 description: Brand ID
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               size:
 *                 type: array
 *                 items:
 *                   type: string
 *               memory:
 *                 type: array
 *                 items:
 *                   type: string
 *               storage:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               shippingInfo:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin or seller)
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product (Admin/Seller only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin or seller)
 *       404:
 *         description: Product not found
 *
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [active, completed]
 *                     totalItems:
 *                       type: number
 *                     totalCartPrice:
 *                       type: number
 *                     totalPriceAfterDiscount:
 *                       type: number
 *                     savings:
 *                       type: number
 *                     coupon:
 *                       type: string
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           price:
 *                             type: number
 *                           color:
 *                             type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Cart not found
 *
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - color
 *               - amount
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add to cart
 *               color:
 *                 type: string
 *                 description: Selected product color
 *               amount:
 *                 type: number
 *                 description: Quantity to add
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     status:
 *                       type: string
 *                     totalItems:
 *                       type: number
 *                     totalCartPrice:
 *                       type: number
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           price:
 *                             type: number
 *                           color:
 *                             type: string
 *       400:
 *         description: Invalid input data or product out of stock
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Cart not found
 *
 * /api/cart/apply-coupon:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Apply coupon to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponCode
 *             properties:
 *               couponCode:
 *                 type: string
 *                 description: Coupon code to apply
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Coupon applied successfully. Discount has been added to your cart total.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     status:
 *                       type: string
 *                     totalItems:
 *                       type: number
 *                     totalCartPrice:
 *                       type: number
 *                     totalPriceAfterDiscount:
 *                       type: number
 *                     savings:
 *                       type: number
 *                     coupon:
 *                       type: string
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           price:
 *                             type: number
 *                           color:
 *                             type: string
 *       400:
 *         description: Invalid coupon code or cart is empty
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Cart not found
 *
 * /api/cart/{itemId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update cart item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: New quantity
 *               color:
 *                 type: string
 *                 description: New color
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     status:
 *                       type: string
 *                     totalItems:
 *                       type: number
 *                     totalCartPrice:
 *                       type: number
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           price:
 *                             type: number
 *                           color:
 *                             type: string
 *       400:
 *         description: Invalid input data or product out of stock
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Cart or cart item not found
 *
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove specific cart item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     status:
 *                       type: string
 *                     totalItems:
 *                       type: number
 *                     totalCartPrice:
 *                       type: number
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           price:
 *                             type: number
 *                           color:
 *                             type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Cart or cart item not found
 *
 * /api/addresses:
 *   post:
 *     tags:
 *       - Address
 *     summary: Add a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *               - details
 *               - phone
 *               - city
 *               - postalCode
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Address nickname (e.g., "Home", "Work")
 *               details:
 *                 type: string
 *                 description: Full address details
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               city:
 *                 type: string
 *                 description: City name
 *               postalCode:
 *                 type: string
 *                 description: Postal/ZIP code
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     alias:
 *                       type: string
 *                     details:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     city:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       400:
 *         description: Invalid input data
 *
 *   get:
 *     tags:
 *       - Address
 *     summary: Get all user addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       alias:
 *                         type: string
 *                       details:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       city:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *
 * /api/addresses/{addressId}:
 *   get:
 *     tags:
 *       - Address
 *     summary: Get a specific address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     alias:
 *                       type: string
 *                     details:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     city:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Address not found
 *
 *   put:
 *     tags:
 *       - Address
 *     summary: Update an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Address nickname
 *               details:
 *                 type: string
 *                 description: Full address details
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               city:
 *                 type: string
 *                 description: City name
 *               postalCode:
 *                 type: string
 *                 description: Postal/ZIP code
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     alias:
 *                       type: string
 *                     details:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     city:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Address not found
 *
 *   delete:
 *     tags:
 *       - Address
 *     summary: Delete an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Address deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Address not found
 *
 * /api/coupons:
 *   get:
 *     tags:
 *       - Coupon
 *     summary: Get all coupons (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       discount:
 *                         type: number
 *                       type:
 *                         type: string
 *                         enum: [percentage, fixed]
 *                       minPurchase:
 *                         type: number
 *                       maxDiscount:
 *                         type: number
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *
 *   post:
 *     tags:
 *       - Coupon
 *     summary: Create a new coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - type
 *               - expiresAt
 *             properties:
 *               code:
 *                 type: string
 *                 description: Coupon code
 *               discount:
 *                 type: number
 *                 description: Discount amount or percentage
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 description: Discount type
 *               minPurchase:
 *                 type: number
 *                 description: Minimum purchase amount required
 *               maxDiscount:
 *                 type: number
 *                 description: Maximum discount amount (for percentage coupons)
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Coupon expiration date
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     discount:
 *                       type: number
 *                     type:
 *                       type: string
 *                     minPurchase:
 *                       type: number
 *                     maxDiscount:
 *                       type: number
 *                     expiresAt:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *
 * /api/coupons/{couponId}:
 *   get:
 *     tags:
 *       - Coupon
 *     summary: Get a specific coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     discount:
 *                       type: number
 *                     type:
 *                       type: string
 *                     minPurchase:
 *                       type: number
 *                     maxDiscount:
 *                       type: number
 *                     expiresAt:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Coupon not found
 *
 *   put:
 *     tags:
 *       - Coupon
 *     summary: Update a coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               minPurchase:
 *                 type: number
 *               maxDiscount:
 *                 type: number
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     discount:
 *                       type: number
 *                     type:
 *                       type: string
 *                     minPurchase:
 *                       type: number
 *                     maxDiscount:
 *                       type: number
 *                     expiresAt:
 *                       type: string
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Coupon not found
 *
 *   delete:
 *     tags:
 *       - Coupon
 *     summary: Delete a coupon (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Coupon deleted successfully
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Coupon not found
 *
 * /api/wishlist:
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: Add product to wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add to wishlist
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product added to wishlist successfully
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Product not found
 *
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Get user's wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *
 * /api/wishlist/{productId}:
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Remove product from wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product removed from wishlist successfully
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Product not found in wishlist
 *
 * /api/products/{productId}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *     responses:
 *       200:
 *         description: List of reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   description: Total number of reviews
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       ratings:
 *                         type: number
 *                       feedback:
 *                         type: string
 *                       timeElapsed:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           userName:
 *                             type: string
 *                           profileImage:
 *                             type: string
 *                       product:
 *                         type: string
 * 
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a new review for a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ratings
 *               - feedback
 *             properties:
 *               ratings:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               feedback:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ratings:
 *                       type: number
 *                     feedback:
 *                       type: string
 *                     timeElapsed:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         userName:
 *                           type: string
 *                         profileImage:
 *                           type: string
 *                     product:
 *                       type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not a user)
 * 
 * /api/products/{productId}/reviews/{reviewId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get a specific review
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ratings:
 *                       type: number
 *                     feedback:
 *                       type: string
 *                     timeElapsed:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         userName:
 *                           type: string
 *                         profileImage:
 *                           type: string
 *                     product:
 *                       type: string
 *       404:
 *         description: Review not found
 * 
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratings:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               feedback:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     ratings:
 *                       type: number
 *                     feedback:
 *                       type: string
 *                     timeElapsed:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         userName:
 *                           type: string
 *                         profileImage:
 *                           type: string
 *                     product:
 *                       type: string
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not the review owner)
 *       404:
 *         description: Review not found or not authorized to update
 * 
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not the review owner or admin)
 *       404:
 *         description: Review not found or not authorized to delete
 * 
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   description: Total number of orders
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           userName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       cartItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 imageCover:
 *                                   type: string
 *                             amount:
 *                               type: number
 *                             price:
 *                               type: number
 *                             color:
 *                               type: string
 *                       totalOrderPrice:
 *                         type: number
 *                       shippingAddress:
 *                         type: object
 *                         properties:
 *                           alias:
 *                             type: string
 *                           details:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           city:
 *                             type: string
 *                           postalCode:
 *                             type: string
 *                       paymentMethod:
 *                         type: string
 *                         enum: [cash, card]
 *                       isPaid:
 *                         type: boolean
 *                       paidAt:
 *                         type: string
 *                         format: date-time
 *                       isDelivered:
 *                         type: boolean
 *                       deliveredAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 * 
 * /api/orders/my-orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get user's orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *     responses:
 *       200:
 *         description: List of user's orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   description: Total number of orders
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not a user)
 * 
 * /api/orders/seller-orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get seller's orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., -createdAt for descending)
 *     responses:
 *       200:
 *         description: List of seller's orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: integer
 *                   description: Total number of orders
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not a seller)
 * 
 * /api/orders/{cartId}:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - alias
 *                   - details
 *                   - phone
 *                   - city
 *                   - postalCode
 *                 properties:
 *                   alias:
 *                     type: string
 *                   details:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card]
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not a user)
 *       404:
 *         description: Cart not found
 * 
 * /api/orders/my-orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a specific user order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not the order owner)
 *       404:
 *         description: Order not found
 * 
 * /api/orders/seller-orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a specific seller order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not the seller of products in order)
 *       404:
 *         description: Order not found
 * 
 * /api/orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a specific order (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Order not found
 * 
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order details (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *               isDelivered:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Order not found
 * 
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Delete an order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully.
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not authorized to delete)
 *       404:
 *         description: Order not found
 * 
 * /api/orders/checkout-session/{cartId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Create checkout session for card payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 session:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: Stripe checkout session URL
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Forbidden (not a user)
 *       404:
 *         description: Cart not found
 * 
 * /api/chat:
 *   post:
 *     summary: Send a message to the chatbot
 *     description: |
 *       Send a message to the chatbot. Authentication is optional:
 *       - If authenticated, chat history will be saved
 *       - If not authenticated, chat will work without saving history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     responses:
 *       200:
 *         description: Chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Invalid message format
 * 
 * /api/chat/history:
 *   get:
 *     summary: Get user's chat history
 *     description: Get the chat history for the authenticated user. Requires authentication.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistory'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User role not allowed
 *   delete:
 *     summary: Clear user's chat history
 *     description: Clear the chat history for the authenticated user. Requires authentication.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Chat history cleared successfully"
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User role not allowed
 */ 