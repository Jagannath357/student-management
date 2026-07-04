# ===============================
# Stage 1 - Build the application
# ===============================
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy project source
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# ===============================
# Stage 2 - Run the application
# ===============================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy generated jar
COPY --from=build /app/target/*.jar app.jar

# Spring Boot Port
EXPOSE 8080

# Start Application
ENTRYPOINT ["java","-jar","app.jar"]