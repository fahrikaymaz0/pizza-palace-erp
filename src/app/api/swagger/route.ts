import { NextResponse } from 'next/server';

export async function GET() {
  const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Dinamik ERP API",
      description: "Backend API dokümantasyonu - Frontendci ve Mobilci için",
      version: "1.0.0",
      contact: {
        name: "Backendci",
        email: "backend@kaymaz.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server"
      }
    ],
    paths: {
      "/users": {
        get: {
          summary: "Kullanıcıları getir",
          description: "Tüm kullanıcıları listeler",
          responses: {
            "200": {
              description: "Başarılı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            email: { type: "string" },
                            role: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Yeni kullanıcı ekle",
          description: "Yeni kullanıcı oluşturur",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                  },
                  required: ["name", "email", "password"]
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Kullanıcı oluşturuldu"
            }
          }
        }
      },
      "/products": {
        get: {
          summary: "Ürünleri getir",
          description: "Tüm ürünleri listeler",
          responses: {
            "200": {
              description: "Başarılı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            price: { type: "number" },
                            description: { type: "string" },
                            image: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/orders": {
        get: {
          summary: "Siparişleri getir",
          description: "Tüm siparişleri listeler",
          responses: {
            "200": {
              description: "Başarılı"
            }
          }
        },
        post: {
          summary: "Yeni sipariş oluştur",
          description: "Yeni sipariş ekler",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userId: { type: "string" },
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          productId: { type: "string" },
                          quantity: { type: "number" }
                        }
                      }
                    },
                    totalAmount: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Sipariş oluşturuldu"
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  };

  return NextResponse.json(swaggerDocument);
} 