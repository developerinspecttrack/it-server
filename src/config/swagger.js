import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "InspectTrack API",
        version: "1.0.0",
        description: "API documentation for InspectTrack",
    },
    
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📜 Swagger Docs available at http://localhost:3000/api-docs");
};

export default swaggerDocs;
