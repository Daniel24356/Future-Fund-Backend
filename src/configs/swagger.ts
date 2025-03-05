// swagger.config.ts

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";


export const setupSwagger = (app: Express) => {
  const options = {
    swaggerDefinition: 
    {
      openapi: "3.0.0", // OpenAPI version
      info: {
        title: "Your API Documentation",
        version: "1.0.0",
        description: "API documentation for your app",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3010}/api/v1`, // Your server URL
          description: "Local server",
        },
      ],
      "paths": {
    "/users": {
      "post": {
        "summary": "Create a new user",
        "tags": ["Users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserDTO"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created successfully"
          },
          "409": {
            "description": "Email already taken"
          }
        }
      },
      "get": {
        "summary": "Retrieve all users (Admin Only)",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "List of all users"
          },
          "403": {
            "description": "Forbidden, Admin access required"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "summary": "Retrieve a user by ID",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the user"
          }
        ],
        "responses": {
          "200": {
            "description": "User retrieved successfully"
          },
          "404": {
            "description": "User not found"
          }
        }
      },
      "patch": {
        "summary": "Update user details",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the user to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User updated successfully"
          },
          "404": {
            "description": "User not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a user",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "The ID of the user to delete"
          }
        ],
        "responses": {
          "200": {
            "description": "User deleted successfully"
          },
          "404": {
            "description": "User not found"
          }
        }
      }
    },
    "/users/auth/profile": {
      "get": {
        "summary": "Get the authenticated user's profile",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "User profile retrieved successfully"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/users/profile-pic": {
      "put": {
        "summary": "Upload and update profile picture",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "profilePic": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Profile picture updated successfully"
          },
          "400": {
            "description": "No profile image uploaded"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/users/change-password": {
      "post": {
        "summary": "Change the authenticated user's password",
        "tags": ["Users"],
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "oldPassword": {
                    "type": "string",
                    "example": "OldPassword123"
                  },
                  "newPassword": {
                    "type": "string",
                    "example": "NewSecurePassword456"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Password changed successfully"
          },
          "400": {
            "description": "Current password is incorrect or new password was used before"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    }
  },
      components: {
        schemas: {
          CreateUserDTO: {
            type: "object",
            properties: {
              firstName: {
                type: "string",
                description: "User's first name",
                example: "John"
              },
              lastName: {
                type: "string",
                description: "User's last name",
                example: "Doe"
              },
              email: {
                type: "string",
                format: "email",
                description: "User's email address",
                example: "john.doe@example.com"
              },
              password: {
                type: "string",
                description: "User's password",
                example: "password123"
              },
              phoneNumber: {
                type: "string",
                description: "User's phone number",
                example: "+1234567890"
              },
              role: {
                type: "string",
                enum: ["USER", "ADMIN"],
                description: "Role of the user (USER or ADMIN)",
                example: "USER"
              },
              applicationId: {
                type: "string",
                description: "The application ID associated with the user",
                example: "app-12345"
              },
              messageId: {
                type: "string",
                description: "Message ID associated with the user",
                example: "msg-67890"
              }
            },
            required: [
              "firstName",
              "lastName",
              "email",
              "password",
              "phoneNumber",
              "applicationId",
              "messageId"
            ]
          },
      
          User: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "User's unique ID",
                example: 1
              },
              firstName: {
                type: "string",
                description: "User's first name",
                example: "John"
              },
              lastName: {
                type: "string",
                description: "User's last name",
                example: "Doe"
              },
              email: {
                type: "string",
                format: "email",
                description: "User's email address",
                example: "john.doe@example.com"
              },
              phoneNumber: {
                type: "string",
                description: "User's phone number",
                example: "+1234567890"
              },
              role: {
                type: "string",
                description: "User's role",
                example: "USER"
              }
            }
          }
        }
      },

      
      

    },
    apis: ["../Route/userRouter.ts", "../controllers/user.controller.ts"], 
  };

  const swaggerSpec = swaggerJSDoc(options);

  console.log(JSON.stringify(swaggerSpec, null, 2));  // Log the spec

  // Set up Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
