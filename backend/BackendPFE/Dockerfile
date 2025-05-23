# ---------- Stage 1: Build ----------
FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests


# ---------- Stage 2: Run ----------
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy built JAR
COPY --from=build /app/target/BackendPFE-0.0.1-SNAPSHOT.jar app.jar

# Copy Python files
COPY src/main/resources/ml-python ./ml-python

# Install Python & pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies (optional)
RUN pip3 install --no-cache-dir -r ml-python/requirements.txt || true

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]
