# ------------ Stage 1: Build backend with Maven wrapper ------------
FROM openjdk:17-jdk AS build

WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .
# Ensure mvnw is executable
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw package -DskipTests


# ------------ Stage 2: Run the app with Python support ------------
FROM openjdk:17-jdk

# Install Python & pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/BackendPFE-0.0.1-SNAPSHOT.jar app.jar

# Copy your Python script directory (assume it's inside src/main/resources/ml-python)
COPY src/main/resources/ml-python ./ml-python

# Optional: Install Python dependencies (if you use scikit-learn, pandas, etc.)
# Make sure you include a requirements.txt file in ml-python
RUN pip3 install --no-cache-dir -r ml-python/requirements.txt || true

# Expose the server port
EXPOSE 9000

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
